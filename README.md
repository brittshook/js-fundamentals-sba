# SBA 308: JavaScript Fundamentals

This program gathers data from a course information object, assignment group object with information about course assignments, and array of student assignment submission objects to generate an array of object with each student's grading information, including individual assignment grades and weighted average.

## About the functions

### Error Handling
This program is composed of a main function, getLearnerData, and two helper functions, setDefault and getAssignmentInfo.

Within getLearnerData, there are two try/catches for error handling: 

1. The first checks that the class ID is the same for the course information object and assignment group object, thereby ensuring the correct assignment information is being pulled.
```javascript
try {
    if (courseInfo.id == assignmentGroup.course_id) {
        ...
    } else {
        throw new Error('Error - Assignment group does not belong to this course');
    }
} catch(err) {
    console.log(err);
}
```

2. The second checks whether the assignment (within the assignment group object) has a due date. An error is thrown if there is a missing due date, as a due date would be required to process and grade assignments.
```javascript
try {
    if (due_at) {
        ...
    } else {
        throw new Error(`Error - Assignment ${assignment_id} is missing due date`);
    }
} catch(err) {
    console.log(err);
}
```

Other potential errors are also mitigated. In the case of type errors, I'm utilizing parseInt to convert strings to numbers in cases where numbers are expected.
```javascript
if (Date.now() > Date.parse(due_at) && parseInt(points_possible)) {
    result[learner_id][assignment_id] = {
        score: parseInt(score),
        points_possible: parseInt(points_possible)
    }
}
```

In the above example, the if statement is first checking that the due date has passed (and can now be graded), and that the points possible on the assignment is non-zero. Assigments with 0 possible points shoud not be graded to avoid weighted averages exceeding 100% and issues with dividing by 0.

### General approach
To keep my code efficient and readable, I often utilized destructuring assignment. 
```javascript
for (const { learner_id, assignment_id, submission } of learnerSubmissions) {
    const { score, submitted_at } = submission
    const { points_possible, due_at } = getAssignmentInfo(assignment_id, assignmentGroup);

    setDefault(result, learner_id, { id: parseInt(learner_id) });
```

While I needed to output an array of objects from getLearnerData, I went the route of creating a object of objects and converting it to an array at the end. This approch made the process of accessing relevant properties and creating new properties simpler.
```javascript
const result = {};
...
return Object.values(result);
```