// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};
  
// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};
  
// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

// Helper Functions
function setDefault(obj, key, value) {
    if (!obj[key]) {
        obj[key] = value;
    }
}

function getAssignmentInfo(assignmentId, assignmentGroup) {
    for (const { id, points_possible, due_at } of assignmentGroup.assignments) {
        if ( id === assignmentId) {
            return { points_possible, due_at };
        }
    }
}

// Main Function
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
        if (courseInfo.id == assignmentGroup.course_id) {
            const result = {};

            for (const { learner_id, assignment_id, submission } of learnerSubmissions) {
                const { score, submitted_at } = submission;
                const { points_possible, due_at } = getAssignmentInfo(assignment_id, assignmentGroup);

                setDefault(result, learner_id, { id: parseInt(learner_id) });

                try {
                    if (due_at) {
                        if (Date.now() > Date.parse(due_at) && parseInt(points_possible)) {
                            result[learner_id][assignment_id] = {
                                score: parseInt(score),
                                points_possible: parseInt(points_possible)
                            }
                        }
        
                        if (Date.parse(submitted_at) > Date.parse(due_at)) {
                            result[learner_id][assignment_id].late = true;
                        }
                    } else {
                        throw new Error(`Error - Assignment ${assignment_id} is missing due date`);
                    }
                } catch(err) {
                    console.log(err);
                }
            }

            for (const learner in result) {
                const { id, ...assignments } = result[learner];
                let totalPointsEarned = 0;
                let totalPossiblePoints = 0;
                setDefault(result[learner], 'avg', 0);

                for (const assignment in assignments) {
                    let assignmentData = result[learner][assignment];

                    if (assignmentData.late) {
                       assignmentData.score -= .1 * assignmentData.points_possible;
                    } 

                    totalPointsEarned += assignmentData.score;
                    totalPossiblePoints += assignmentData.points_possible;

                    result[learner][assignment] = assignmentData.score / assignmentData.points_possible; 
                }

                result[learner].avg = totalPointsEarned / totalPossiblePoints;
            }

            return Object.values(result);
        } else {
            throw new Error('Error - Assignment group does not belong to this course');
        }
    } catch(err) {
        console.log(err);
    }
}

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));