//Application Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

db.connect(err => {
    if(err) throw err;
})

//Initial Application Menu Options
const appOptions = () => {

    console.log(`
    ===============================
    Weclome to the Employee Tracker
    ===============================
    `);

    return inquirer.prompt([

        {
            type: 'list',
            name: 'userAction',
            choices: ["View All Departments", "View All Roles", "View All Employees", 
            "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"],           
            message: "Hello! Please choose your action from the menu below:"
        }
    
    ])
    .then(userOption => {
        const {useAction} = userOption;

        if(userOption.userAction === 'View All Departments') {
            console.log('View All Departments was selected')
            //Show Table (Dept) with department names and department ids
            viewDepts();

        } else if (userOption.userAction === 'View All Roles') {
            console.log('View All Roles was selected')
            //Show Table (Roles) with job title, role id, the department that role belongs to, 
            //and the salary for that role
            viewRoles();

        } else if (userOption.userAction === 'View All Employees') {
            console.log('View All Employees was selected')
            //Show Table (Employees) with employee data, including employee ids, first names, last names,
            // job titles, departments, salaries, and managers that the employees report to
            viewEmployees();

        } else if (userOption.userAction === 'Add a Department') {
            console.log('Add a Department was selected')
            //Create a function that when prompted to enter the name of the department and that department
            // is added to the database
            addDept();

        } else if (userOption.userAction === 'Add a Role') {
            console.log('Add a Role was selected')
            //Create a function that when prompted to enter the name, salary, and department for the role and that role is added to the database
            addRole();

        } else if (userOption.userAction === 'Add an Employee') {
            console.log('Add an Employee was selected')
            //Create a function that prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
            addEmployee();

        } else if (userOption.userAction === 'Update an Employee Role') {
            console.log('Update an Employee Role')
            //Create a function that prompted to select an employee and then prompts the user for the role to update and their new role and this information in the database
            updateEmployee();
        }; 

        
    });
};

//Show Table (Dept) with department names and department ids
viewDepts = () => {
    console.log(`
     ===========
     Departments 
     ===========
    `);
    // retrieve department information
    const sql = `SELECT department.id AS id,
                department.name as department 
                FROM department`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        // appOptions()

    });
};

//Create a function that when prompted to enter the name of the department and that department is added to the database
addDept = () => {

    console.log(`
    =======================
    Adding a New Department
    =======================
    `);

    return inquirer.prompt([

        {
            type: 'input',
            name: 'deptName',
            message: "Please enter the name of the new Department",
        },
    ])
    .then(newDept => {
        const {deptName} = newDept;
        console.log()

        if(userOption.userAction === 'View All Departments') {
            console.log('View All Departments was selected')
            //Show Table (Dept) with department names and department ids

        } else if (userOption.userAction === 'View All Roles') {
            console.log('View All Roles was selected')
            //Show Table (Roles) with job title, role id, the department that role belongs to, 
            //and the salary for that role
        }
            
        
    });
};

//Start Application
appOptions();