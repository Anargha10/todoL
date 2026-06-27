import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../models/Task';
import { TaskStatus, TaskPriority, TaskCategory } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const taskTitles = {
  [TaskCategory.PERSONAL]: [
    'Grocery shopping', 'Walk the dog', 'Call mom', 'Plan weekend trip', 'Buy birthday gift',
    'Organize closet', 'Clean garage', 'Water plants', 'Laundry', 'Meal prep for the week',
    'Get a haircut', 'Renew gym membership', 'Read 50 pages', 'Meditate for 20 min', 'Journal entry',
    'Repair bike', 'Wash car', 'Schedule dentist appointment', 'Write thank you note', 'Plan date night',
  ],
  [TaskCategory.WORK]: [
    'Submit Q3 report', 'Prepare for client meeting', 'Review PR #347', 'Update documentation',
    'Code review for auth module', 'Fix bug in payment flow', 'Refactor legacy API', 'Write unit tests',
    'Deploy to staging', 'Update CI/CD pipeline', 'Prepare sprint retrospective', 'Create onboarding doc',
    'Optimize database queries', 'Fix failing E2E tests', 'Update API spec', 'Review architecture proposal',
    'Set up monitoring alerts', 'Migrate legacy users', 'Implement rate limiting', 'Design new dashboard widget',
  ],
  [TaskCategory.STUDY]: [
    'Complete React course module', 'Study TypeScript generics', 'Review algorithm patterns', 'Practice LeetCode',
    'Read Clean Code chapter', 'Prepare for technical interview', 'Learn Docker basics', 'Study system design',
    'Watch GraphQL tutorial', 'Complete MongoDB certification', 'Review data structures', 'Study design patterns',
    'Learn Tailwind CSS', 'Practice system design problems', 'Read CS fundamentals', 'Study AWS basics',
    'Complete Node.js workshop', 'Review REST API best practices', 'Study caching strategies', 'Learn testing patterns',
  ],
  [TaskCategory.HEALTH]: [
    'Morning yoga session', 'Track macros for 3 days', 'Drink 3L water', 'Take vitamins', 'Morning run 5k',
    'Meal prep healthy lunch', 'Schedule annual checkup', 'Sleep by 10pm', 'Stretch routine', 'No sugar day',
    'Meditation session', 'Take a walk after lunch', 'Eye exercises', 'Posture check', 'Foam rolling',
    'Take supplements', 'Deep breathing exercises', 'No phone before bed', 'Meal log for today', 'Bodyweight workout',
  ],
  [TaskCategory.FINANCE]: [
    'Review monthly budget', 'Pay utility bills', 'Transfer to savings', 'Review investment portfolio',
    'Cancel unused subscriptions', 'File expense reports', 'Create emergency fund plan', 'Compare insurance rates',
    'Track daily expenses', 'Set up auto-invest', 'Review credit card statement', 'Plan tax deductions',
    'Pay rent', 'Reconcile bank accounts', 'Review loan options', 'Set financial goals', 'Build credit score plan',
    'Compare brokerage fees', 'Set up 401k contribution', 'Create debt payoff plan',
  ],
  [TaskCategory.CUSTOM]: [
    'Redesign personal website', 'Update LinkedIn profile', 'Build side project MVP', 'Contribute to open source',
    'Write blog post', 'Create YouTube video script', 'Learn new instrument', 'Practice photography',
    'Organize digital files', 'Back up cloud storage', 'Plan home renovation', 'Research new laptop',
    'Learn a new recipe', 'Practice public speaking', 'Start a newsletter', 'Build a small app',
    'Create portfolio piece', 'Learn Figma', 'Record a podcast episode', 'Plan creative project',
  ],
};

const descriptions = [
  'Need to complete this before the deadline. Make sure to double-check all details.',
  'This is a high-priority item that requires careful attention to detail.',
  'Coordinate with the team and get approval before proceeding.',
  'Follow the checklist provided and update the status when done.',
  'Block time on the calendar and focus without distractions.',
  'Review previous notes before starting to ensure consistency.',
  'Reach out to the relevant stakeholders for any clarifications.',
  'Set a reminder to follow up on this later in the week.',
  'Break this down into smaller subtasks if needed.',
  'Document the progress and share updates with the team.',
  'Allocate enough time for testing and quality assurance.',
  'Make sure all dependencies are ready before starting.',
  'Keep track of any blockers and escalate if needed.',
  'Review the requirements document before implementation.',
  'Consider alternative approaches if this one takes too long.',
  'Sync with the design team for any UI-related changes.',
  'Run the test suite after making changes to ensure nothing broke.',
  'Update the wiki or documentation once this is complete.',
  'Schedule a demo to showcase the completed work.',
  'Gather feedback from users and iterate based on their input.',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;
  for (const { item, weight } of items) {
    random -= weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1].item;
}

async function seedDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // Clear existing tasks
  await Task.deleteMany({});
  console.log('Cleared existing tasks');

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const statuses = Object.values(TaskStatus);
  const priorities = Object.values(TaskPriority);
  const categories = Object.values(TaskCategory);

  const tasks: any[] = [];
  const categoriesList = categories;

  // Generate 100 tasks with good distribution
  for (let i = 0; i < 100; i++) {
    const category = randomItem(categoriesList);
    const titles = taskTitles[category];
    const title = `${randomItem(titles)} ${i > 0 ? `#${i}` : ''}`;
    const description = randomItem(descriptions);

    const priority = weightedRandom([
      { item: TaskPriority.LOW, weight: 25 },
      { item: TaskPriority.MEDIUM, weight: 35 },
      { item: TaskPriority.HIGH, weight: 25 },
      { item: TaskPriority.CRITICAL, weight: 15 },
    ]);

    const status = weightedRandom([
      { item: TaskStatus.TODO, weight: 30 },
      { item: TaskStatus.IN_PROGRESS, weight: 25 },
      { item: TaskStatus.COMPLETED, weight: 35 },
      { item: TaskStatus.ARCHIVED, weight: 10 },
    ]);

    const dueDate = randomDate(thirtyDaysAgo, thirtyDaysFromNow);
    const estimatedHours = randomInt(1, 40);

    const createdAt = randomDate(thirtyDaysAgo, now);

    // Completed tasks should have a completedAt date
    const completedAt = status === TaskStatus.COMPLETED
      ? randomDate(createdAt, now)
      : null;

    // Overdue tasks: some Todo/In Progress with past due dates
    let finalDueDate = dueDate;
    if (status !== TaskStatus.COMPLETED && status !== TaskStatus.ARCHIVED && Math.random() < 0.3) {
      // 30% of active tasks are overdue
      finalDueDate = randomDate(thirtyDaysAgo, now);
    }

    // Tasks due soon
    if (status === TaskStatus.TODO && Math.random() < 0.2) {
      finalDueDate = new Date(now.getTime() + randomInt(1, 3) * 24 * 60 * 60 * 1000);
    }

    tasks.push({
      id: uuidv4(),
      title,
      description,
      priority,
      status,
      category,
      dueDate: finalDueDate,
      createdAt,
      updatedAt: randomDate(createdAt, now),
      estimatedHours,
      completedAt,
    });
  }

  // Add some specifically designed tasks for testing features
  const specialTasks = [
    // Overdue high priority
    {
      id: uuidv4(),
      title: 'CRITICAL: Fix production outage',
      description: 'The payment gateway is down and customers cannot complete transactions. Immediate action required.',
      priority: TaskPriority.CRITICAL,
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      completedAt: null,
    },
    // Overdue medium
    {
      id: uuidv4(),
      title: 'Submit tax documents',
      description: 'Need to compile and submit all tax-related documents before the deadline.',
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      category: TaskCategory.FINANCE,
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      estimatedHours: 4,
      completedAt: null,
    },
    // Due soon
    {
      id: uuidv4(),
      title: 'Client presentation tomorrow',
      description: 'Prepare slides and talking points for the quarterly review with the client.',
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      category: TaskCategory.WORK,
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      estimatedHours: 6,
      completedAt: null,
    },
    // Recently completed
    {
      id: uuidv4(),
      title: 'Deploy new landing page',
      description: 'Successfully deployed the redesigned landing page to production.',
      priority: TaskPriority.HIGH,
      status: TaskStatus.COMPLETED,
      category: TaskCategory.WORK,
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      estimatedHours: 12,
      completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    // Completed today
    {
      id: uuidv4(),
      title: 'Morning standup notes',
      description: 'Prepared and shared the standup notes for the team.',
      priority: TaskPriority.LOW,
      status: TaskStatus.COMPLETED,
      category: TaskCategory.WORK,
      dueDate: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
      estimatedHours: 1,
      completedAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
    // Archived
    {
      id: uuidv4(),
      title: 'Old project: Legacy dashboard v1',
      description: 'This was the first version of the dashboard before the redesign. Kept for reference.',
      priority: TaskPriority.LOW,
      status: TaskStatus.ARCHIVED,
      category: TaskCategory.WORK,
      dueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      estimatedHours: 20,
      completedAt: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000),
    },
  ];

  tasks.push(...specialTasks);

  await Task.insertMany(tasks);
  console.log(`Seeded ${tasks.length} tasks successfully!`);

  // Print stats
  const stats = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const priorityStats = await Task.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);
  const categoryStats = await Task.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  console.log('\n📊 Task Distribution:');
  console.log('By Status:', stats.map((s: any) => `${s._id}: ${s.count}`).join(', '));
  console.log('By Priority:', priorityStats.map((s: any) => `${s._id}: ${s.count}`).join(', '));
  console.log('By Category:', categoryStats.map((s: any) => `${s._id}: ${s.count}`).join(', '));

  await mongoose.disconnect();
  console.log('\n✅ Done! Database seeded and disconnected.');
}

seedDatabase().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
