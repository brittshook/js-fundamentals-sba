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

// Your goal is to analyze and transform this data such that the output of your program is an
// array of objects, each containing the following information in the following format:
// {
//     // the ID of the learner for which this data has been collected
//     "id": number,
//     // the learner’s total, weighted average, in which assignments
//     // with more points_possible should be counted for more
//     // e.g. a learner with 50/100 on one assignment and 190/200 on another
//     // would have a weighted average score of 240/300 = 80%.
//     "avg": number,
//     // each assignment should have a key with its ID,
//     // and the value associated with it should be the percentage that
//     // the learner scored on the assignment (submission.score / points_possible)
//     <assignment_id>: number,
//     // if an assignment is not yet due, it should not be included in either
//     // the average or the keyed dictionary of scores
// }

// Similar data validation should occur elsewhere within the program.
// You should also account for potential errors in the data that your program 
// receives. What if points_possible is 0? You cannot divide by zero. What if a 
// value that you are expecting to be a number is instead a string? 
// Use try/catch and other logic to handle these types of errors gracefully.
// If an assignment is not yet due, do not include it in the results or the 
// average. Additionally, if the learner’s submission is late (submitted_at is
// past due_at), deduct 10 percent of the total points possible from their score
// for that assignment. Create a function named getLearnerData() that accepts
// these values as parameters, in the order listed: (CourseInfo, AssignmentGroup, 
// [LearnerSubmission]), and returns the formatted result, which should be an 
// array of objects as described above.
// Use at least two if/else statements to control program flow. Optionally, use at least one switch statement.
// Utilize at least two different types of loops.


function setDefault(obj, key, value) {
    if (!obj[key]) {
        obj[key] = value;
    }
};

const getAssignmentInfo = (assignmentId, assignmentGroup) => {
    for (const { id, points_possible, due_at } of assignmentGroup.assignments) {
        if ( id === assignmentId) {
            return { points_possible, due_at };
        };
    };
};

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    try {
        if (courseInfo.id == assignmentGroup.course_id) {
            const result = {};

            for (const { learner_id, assignment_id, submission } of learnerSubmissions) {
                const { score } = submission;
                const { points_possible, due_at } = getAssignmentInfo(assignment_id, assignmentGroup);

                setDefault(result, learner_id, { id: learner_id });

                if (Date.now() > Date.parse(due_at)) {
                    result[learner_id][assignment_id] = score / points_possible;
                };
            };

            for (const learner in result) {
                const { id, ...assignments } = result[learner];

                for (const assignment in assignments) {
                    setDefault(result[learner], 'avg', 0);
                    result[learner]['avg'] += result[learner][assignment] / Object.keys(assignments).length;
                }
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