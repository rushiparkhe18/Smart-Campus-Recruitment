const AptitudeTest = require('../models/AptitudeTest');
const TestResult = require('../models/TestResult');
const Application = require('../models/Application');
const crypto = require('crypto');

// @desc    Create aptitude test
// @route   POST /api/aptitude/create
// @access  Private (Company)
const createTest = async (req, res) => {
  try {
    const testData = {
      ...req.body,
      company: req.user.id
    };

    const test = await AptitudeTest.create(testData);

    res.status(201).json({
      status: 'success',
      message: 'Test created successfully',
      data: { test }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get available tests for student
// @route   GET /api/aptitude/available
// @access  Private (Student)
const getAvailableTests = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
      status: { $in: ['test-scheduled', 'shortlisted'] },
      testTaken: false
    }).populate({
      path: 'job',
      populate: {
        path: 'aptitudeTest'
      }
    });

    const tests = applications
      .filter(app => app.job.aptitudeTest)
      .map(app => ({
        test: app.job.aptitudeTest,
        job: {
          id: app.job._id,
          title: app.job.title
        },
        application: app._id
      }));

    res.status(200).json({
      status: 'success',
      data: { tests }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Start test (get questions without answers)
// @route   GET /api/aptitude/:id/start
// @access  Private (Student)
const startTest = async (req, res) => {
  try {
    const test = await AptitudeTest.findById(req.params.id);

    if (!test || !test.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found or inactive'
      });
    }

    // Check if already taken
    const existingResult = await TestResult.findOne({
      test: req.params.id,
      student: req.user.id
    });

    if (existingResult) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already taken this test'
      });
    }

    // Prepare questions without correct answers
    let questions = test.questions.map((q, index) => ({
      id: index,
      question: q.question,
      options: q.options,
      marks: q.marks,
      category: q.category
    }));

    // Shuffle questions if enabled
    if (test.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    res.status(200).json({
      status: 'success',
      data: {
        test: {
          id: test._id,
          title: test.title,
          description: test.description,
          duration: test.duration,
          questionsCount: questions.length,
          startTime: new Date()
        },
        questions
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Submit test and calculate score
// @route   POST /api/aptitude/:id/submit
// @access  Private (Student)
const submitTest = async (req, res) => {
  try {
    const { answers, startTime, applicationId } = req.body;

    const test = await AptitudeTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Calculate score
    let score = 0;
    let totalMarks = 0;

    test.questions.forEach((question, index) => {
      totalMarks += question.marks;
      const studentAnswer = answers.find(a => a.questionIndex === index);
      
      if (studentAnswer && studentAnswer.selectedOption === question.correctAnswer) {
        score += question.marks;
      }
    });

    const percentage = (score / totalMarks) * 100;
    const passed = percentage >= test.passingScore;

    // Create test result
    const result = await TestResult.create({
      test: test._id,
      student: req.user.id,
      application: applicationId,
      answers,
      score,
      totalMarks,
      percentage,
      passed,
      startTime,
      submitTime: new Date(),
      timeTaken: Math.floor((new Date() - new Date(startTime)) / 1000)
    });

    // Update application
    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (application) {
        application.testTaken = true;
        application.testScore = percentage;
        application.status = 'test-completed';
        await application.save();
      }
    }

    // Update test attempts count
    test.attemptsCount += 1;
    await test.save();

    res.status(201).json({
      status: 'success',
      message: 'Test submitted successfully',
      data: {
        result: {
          score,
          totalMarks,
          percentage: percentage.toFixed(2),
          passed,
          timeTaken: result.timeTaken
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get student's test results
// @route   GET /api/aptitude/results
// @access  Private (Student)
const getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ student: req.user.id })
      .populate('test', 'title description')
      .populate('application')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { results }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get test results for company
// @route   GET /api/aptitude/:id/results
// @access  Private (Company)
const getTestResults = async (req, res) => {
  try {
    const test = await AptitudeTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    if (test.company.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    const results = await TestResult.find({ test: req.params.id })
      .populate('student', 'name email studentProfile')
      .sort('-percentage');

    res.status(200).json({
      status: 'success',
      data: { results, count: results.length }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get company's created tests
// @route   GET /api/aptitude/company
// @access  Private (Company)
const getCompanyTests = async (req, res) => {
  try {
    const tests = await AptitudeTest.find({ company: req.user.id })
      .populate('job', 'title')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete test
// @route   DELETE /api/aptitude/:id
// @access  Private (Company)
const deleteTest = async (req, res) => {
  try {
    const test = await AptitudeTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        status: 'error',
        message: 'Test not found'
      });
    }

    // Check ownership
    if (test.company.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    await test.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createTest,
  getCompanyTests,
  deleteTest,
  getAvailableTests,
  startTest,
  submitTest,
  getMyResults,
  getTestResults
};
