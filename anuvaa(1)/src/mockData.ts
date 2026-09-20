export const STUDENTS = [
  { id: '1', name: 'सुनीता (Sunita)', grade: 'Class 2', color: 'bg-teal/10 text-teal', icon: 'User' },
  { id: '2', name: 'रमेश (Ramesh)', grade: 'Class 2', color: 'bg-terracotta/10 text-terracotta', icon: 'Smile' },
  { id: '3', name: 'मीना (Meena)', grade: 'Class 2', color: 'bg-ochre/10 text-ochre', icon: 'Star' },
  { id: '4', name: 'अजय (Ajay)', grade: 'Class 2', color: 'bg-blue-100 text-blue-700', icon: 'User' },
  { id: '5', name: 'गीता (Geeta)', grade: 'Class 2', color: 'bg-rose-100 text-rose-700', icon: 'Smile' },
  { id: '6', name: 'राहुल (Rahul)', grade: 'Class 2', color: 'bg-purple-100 text-purple-700', icon: 'Star' },
];

export const CLASS_MARKS = [
  { id: '1', name: 'सुनीता (Sunita)', score: '8/10', numericScore: 8, status: 'Submitted', flagged: false, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '8/10' }, { date: '08 Sep', title: 'गिनती', score: '7/10' }] },
  { id: '2', name: 'रमेश (Ramesh)', score: '6/10', numericScore: 6, status: 'Submitted', flagged: false, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '6/10' }, { date: '08 Sep', title: 'गिनती', score: '5/10' }] },
  { id: '3', name: 'मीना (Meena)', score: '-', numericScore: 0, status: 'Pending', flagged: true, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '-' }, { date: '08 Sep', title: 'गिनती', score: '4/10' }] },
  { id: '4', name: 'अजय (Ajay)', score: '9/10', numericScore: 9, status: 'Submitted', flagged: false, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '9/10' }, { date: '08 Sep', title: 'गिनती', score: '10/10' }] },
  { id: '5', name: 'गीता (Geeta)', score: '4/10', numericScore: 4, status: 'Submitted', flagged: true, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '4/10' }, { date: '08 Sep', title: 'गिनती', score: '3/10' }] },
  { id: '6', name: 'राहुल (Rahul)', score: '-', numericScore: 0, status: 'Pending', flagged: false, history: [{ date: '10 Sep', title: 'रंगों के नाम', score: '-' }, { date: '08 Sep', title: 'गिनती', score: '-' }] },
];

export const STUDENT_QUIZZES = [
  { id: 'q1', title: 'रंगों के नाम (Colors)', stars: 3 },
  { id: 'q2', title: 'गिनती (Numbers 1-10)', stars: 2 },
  { id: 'q3', title: 'जानवर (Animals)', stars: 3 },
];
