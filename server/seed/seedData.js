const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Job = require('../models/Job');
const AptitudeTest = require('../models/AptitudeTest');
const ForumPost = require('../models/ForumPost');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Job.deleteMany({});
        await AptitudeTest.deleteMany({});
        await ForumPost.deleteMany({});
        
        console.log('👤 Creating users...');
        
        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@campushire.com',
            password: 'Admin@123',
            role: 'admin',
            isApproved: true
        });
        console.log('✅ Admin created');
        
        // Create Companies
        const google = await User.create({
            name: 'Google Recruiter',
            email: 'hr@google.com',
            password: 'Google@123',
            role: 'company',
            isApproved: true,
            companyProfile: {
                companyName: 'Google Inc.',
                industry: 'Technology',
                website: 'https://google.com',
                about: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, and more.',
                location: 'Mountain View, CA',
                size: '500+',
                founded: 1998
            }
        });
        
        const microsoft = await User.create({
            name: 'Microsoft HR',
            email: 'hr@microsoft.com',
            password: 'Microsoft@123',
            role: 'company',
            isApproved: true,
            companyProfile: {
                companyName: 'Microsoft Corporation',
                industry: 'Technology',
                website: 'https://microsoft.com',
                about: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and related services.',
                location: 'Redmond, WA',
                size: '500+',
                founded: 1975
            }
        });
        
        const amazon = await User.create({
            name: 'Amazon Recruiter',
            email: 'hr@amazon.com',
            password: 'Amazon@123',
            role: 'company',
            isApproved: true,
            companyProfile: {
                companyName: 'Amazon',
                industry: 'E-commerce & Cloud',
                website: 'https://amazon.com',
                about: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and AI.',
                location: 'Seattle, WA',
                size: '500+',
                founded: 1994
            }
        });
        
        console.log('✅ Companies created');
        
        // Create Students
        const students = await User.insertMany([
            {
                name: 'Rahul Sharma',
                email: 'rahul@student.com',
                password: 'Student@123',
                role: 'student',
                studentProfile: {
                    rollNumber: 'CSE2021001',
                    department: 'CSE',
                    batch: 2025,
                    cgpa: 8.5,
                    phone: '9876543210',
                    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
                    education: [{
                        degree: 'B.Tech in Computer Science',
                        institution: 'IIT Delhi',
                        year: 2025,
                        percentage: 85
                    }],
                    projects: [{
                        title: 'E-commerce Platform',
                        description: 'Built a full-stack e-commerce platform using MERN stack',
                        link: 'https://github.com/rahul/ecommerce',
                        technologies: ['React', 'Node.js', 'MongoDB', 'Express']
                    }]
                }
            },
            {
                name: 'Priya Patel',
                email: 'priya@student.com',
                password: 'Student@123',
                role: 'student',
                studentProfile: {
                    rollNumber: 'IT2021002',
                    department: 'IT',
                    batch: 2025,
                    cgpa: 9.2,
                    phone: '9876543211',
                    skills: ['Java', 'Spring Boot', 'MySQL', 'Angular', 'Docker'],
                    education: [{
                        degree: 'B.Tech in Information Technology',
                        institution: 'NIT Trichy',
                        year: 2025,
                        percentage: 92
                    }],
                    projects: [{
                        title: 'Hospital Management System',
                        description: 'Developed a comprehensive hospital management system',
                        link: 'https://github.com/priya/hms',
                        technologies: ['Spring Boot', 'Angular', 'MySQL']
                    }]
                }
            },
            {
                name: 'Amit Kumar',
                email: 'amit@student.com',
                password: 'Student@123',
                role: 'student',
                studentProfile: {
                    rollNumber: 'CSE2021003',
                    department: 'CSE',
                    batch: 2025,
                    cgpa: 7.8,
                    phone: '9876543212',
                    skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow'],
                    education: [{
                        degree: 'B.Tech in Computer Science',
                        institution: 'BITS Pilani',
                        year: 2025,
                        percentage: 78
                    }]
                }
            }
        ]);
        
        console.log('✅ Students created');
        
        console.log('💼 Creating jobs...');
        
        // Create Jobs
        const jobs = await Job.insertMany([
            {
                company: google._id,
                title: 'Software Engineer',
                description: 'We are looking for talented software engineers to join our team. You will work on cutting-edge technologies and solve complex problems at scale.',
                skills: ['JavaScript', 'Python', 'Data Structures', 'Algorithms'],
                jobType: 'Full-Time',
                location: 'Bangalore',
                workMode: 'Hybrid',
                salary: { min: 1200000, max: 1800000 },
                eligibility: {
                    minCGPA: 7.5,
                    departments: ['CSE', 'IT'],
                    batches: [2025]
                },
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                isActive: true
            },
            {
                company: microsoft._id,
                title: 'Full Stack Developer Intern',
                description: 'Join Microsoft as a Full Stack Developer Intern and work on real-world projects that impact millions of users worldwide.',
                skills: ['React', 'Node.js', 'Azure', 'TypeScript'],
                jobType: 'Internship',
                location: 'Hyderabad',
                workMode: 'On-site',
                salary: { min: 50000, max: 70000 },
                eligibility: {
                    minCGPA: 7.0,
                    departments: ['CSE', 'IT', 'ECE'],
                    batches: [2025, 2026]
                },
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                isActive: true
            },
            {
                company: amazon._id,
                title: 'SDE-1 (Backend)',
                description: 'Amazon is hiring Backend Engineers to work on scalable distributed systems. Great opportunity to work with cutting-edge cloud technologies.',
                skills: ['Java', 'Spring Boot', 'AWS', 'Microservices'],
                jobType: 'Full-Time',
                location: 'Mumbai',
                workMode: 'Remote',
                salary: { min: 1500000, max: 2000000 },
                eligibility: {
                    minCGPA: 8.0,
                    departments: ['CSE', 'IT'],
                    batches: [2025]
                },
                deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                isActive: true
            },
            {
                company: google._id,
                title: 'Data Scientist',
                description: 'Work on machine learning models and data analysis to drive business decisions at Google.',
                skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
                jobType: 'Full-Time',
                location: 'Bangalore',
                workMode: 'Hybrid',
                salary: { min: 1400000, max: 2200000 },
                eligibility: {
                    minCGPA: 8.5,
                    departments: ['CSE', 'IT'],
                    batches: [2025]
                },
                deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                isActive: true
            }
        ]);
        
        console.log('✅ Jobs created');
        
        console.log('📝 Creating aptitude tests...');
        
        // Create Aptitude Tests
        const tests = await AptitudeTest.insertMany([
            {
                company: google._id,
                job: jobs[0]._id,
                title: 'Software Engineer Aptitude Test',
                description: 'Test your aptitude, logical reasoning, and basic programming skills',
                duration: 60,
                passingScore: 60,
                questions: [
                    {
                        question: 'What is the time complexity of binary search?',
                        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                        correctAnswer: 1,
                        marks: 2,
                        category: 'Technical'
                    },
                    {
                        question: 'Which data structure uses LIFO?',
                        options: ['Queue', 'Stack', 'Tree', 'Graph'],
                        correctAnswer: 1,
                        marks: 2,
                        category: 'Technical'
                    },
                    {
                        question: 'If A is 5 years older than B and B is 3 years younger than C, who is the oldest?',
                        options: ['A', 'B', 'C', 'Cannot determine'],
                        correctAnswer: 0,
                        marks: 1,
                        category: 'Logical'
                    },
                    {
                        question: 'Find the next number in series: 2, 6, 12, 20, 30, ?',
                        options: ['40', '42', '44', '46'],
                        correctAnswer: 1,
                        marks: 1,
                        category: 'Aptitude'
                    },
                    {
                        question: 'In a race, if you overtake the person in 2nd place, what position are you in?',
                        options: ['1st', '2nd', '3rd', '4th'],
                        correctAnswer: 1,
                        marks: 1,
                        category: 'Logical'
                    }
                ],
                shuffleQuestions: true,
                isActive: true
            }
        ]);
        
        console.log('✅ Aptitude tests created');
        
        console.log('💬 Creating forum posts...');
        
        // Create Forum Posts
        const forumPosts = await ForumPost.insertMany([
            {
                author: students[0]._id,
                title: 'Tips for cracking Google Interview',
                content: 'Just got placed at Google! Here are my top tips:\n1. Focus on Data Structures & Algorithms\n2. Practice on LeetCode daily\n3. Understand system design basics\n4. Be confident in interviews\n5. Ask clarifying questions',
                tags: ['Placement', 'Interview', 'Career'],
                upvoteCount: 25
            },
            {
                author: students[1]._id,
                title: 'Best resources for learning React?',
                content: 'I am learning React for upcoming placements. Can anyone suggest good free resources?',
                tags: ['Web Dev', 'General'],
                upvoteCount: 10,
                comments: [
                    {
                        author: students[2]._id,
                        content: 'Official React docs are the best! Also try FreeCodeCamp and Scrimba.'
                    }
                ]
            },
            {
                author: students[2]._id,
                title: 'How to prepare for aptitude tests?',
                content: 'Most companies have aptitude rounds. What are the best books/websites to practice?',
                tags: ['Aptitude', 'Placement'],
                upvoteCount: 15
            },
            {
                author: students[0]._id,
                title: 'DSA Study Plan - 3 Months',
                content: 'Month 1: Arrays, Strings, Sorting\nMonth 2: LinkedList, Stack, Queue, Trees\nMonth 3: Graphs, DP, Advanced topics\nPractice minimum 2 problems daily!',
                tags: ['DSA', 'Placement'],
                upvoteCount: 30
            }
        ]);
        
        console.log('✅ Forum posts created');
        
        console.log('\n========================================');
        console.log('🎉 SEED DATA CREATED SUCCESSFULLY!');
        console.log('========================================\n');
        
        console.log('📊 Summary:');
        console.log(`✅ Admin: 1`);
        console.log(`✅ Companies: 3 (Google, Microsoft, Amazon)`);
        console.log(`✅ Students: ${students.length}`);
        console.log(`✅ Jobs: ${jobs.length}`);
        console.log(`✅ Aptitude Tests: ${tests.length}`);
        console.log(`✅ Forum Posts: ${forumPosts.length}`);
        
        console.log('\n📧 Login Credentials:');
        console.log('\n👨‍💼 Admin:');
        console.log('   Email: admin@campushire.com');
        console.log('   Password: Admin@123');
        
        console.log('\n🏢 Companies:');
        console.log('   Google: hr@google.com / Google@123');
        console.log('   Microsoft: hr@microsoft.com / Microsoft@123');
        console.log('   Amazon: hr@amazon.com / Amazon@123');
        
        console.log('\n👨‍🎓 Students:');
        console.log('   Rahul: rahul@student.com / Student@123');
        console.log('   Priya: priya@student.com / Student@123');
        console.log('   Amit: amit@student.com / Student@123');
        
        console.log('\n========================================\n');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run seed
connectDB().then(() => {
    seedData();
});
