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
            message: "Please choose your action from the menu below:"
        }
    
    ])
    .then(userOption => {
        const {useAction} = userOption;

        if(userOption.userAction === 'View All Departments') {
            viewDepts();

        } else if (userOption.userAction === 'View All Roles') {
            viewRoles();

        } else if (userOption.userAction === 'View All Employees') {
            viewEmployees();

        } else if (userOption.userAction === 'Add a Department') {
            addDept();

        } else if (userOption.userAction === 'Add a Role') {
            addRole();

        } else if (userOption.userAction === 'Add an Employee') {
            addEmployee();

        } else if (userOption.userAction === 'Update an Employee Role') {
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
    const sql = `SELECT department.id AS id,
                department.name AS department 
                FROM department`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        appOptions()

    });
};


//Show Table (Roles) with job title, role id, the department that role belongs to, 
//and the salary for that role
viewRoles = () => {
    console.log(`
                    =====
                    Roles 
                    =====
    `);
    const sql = `SELECT role.title AS 'Job Title',
                role.id AS 'ID',
                department.name as 'Department',
                role.salary as 'Salary'
                FROM role
                INNER JOIN department ON role.department_id=department.id;`
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        appOptions()

    });
};

//Show Table (Employees) with employee data, including employee ids, first names, last names,
// job titles, departments, salaries, and managers that the employees report to
viewEmployees = () => {
    console.log(`
                    ==========
                    Empoloyees 
                    ==========
    `);
    const sql = `SELECT
                    employee.id AS employee_id,
                    employee.first_name,
                    employee.last_name,
                    role.title AS job_title,
                    department.name AS department,
                    role.salary AS salary,
                    CONCAT(manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                INNER JOIN role ON employee.role_id=role.id
                INNER JOIN department ON role.department_id=department.id
                LEFT JOIN employee manager ON employee.manager_id=manager.id`;
    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
        appOptions()

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
    .then(deptAnswer => {
        const sql = `INSERT INTO department (name)
                        VALUES (?)`
        const params = [deptAnswer.deptName];
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log(deptAnswer.deptName + ' has been added as a department.');
            appOptions();
        }); 
    });
}

//Create a function that when prompted to enter the name, salary, and department for the role and that role is added to the database
addRole = () => {

    const sql = `SELECT * FROM department`
    db.query(sql, (err, response) => {
        if(err) throw err;
        let deptArray = [];
        response.forEach((department) => {
            let deptObj = {
                name: department.name,
                value: department.id
            }
            deptArray.push(deptObj);
        });

    console.log(`
                =================
                Adding a New Role
                =================
    `);

    return inquirer.prompt([

        {
            type: 'input',
            name: 'roleName',
            message: "Please enter the name of the new role.",
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "Please enter the salary of the new role.",
        },
        {
            name: 'deptName',
            type: 'list',
            message: 'Please select the department associated with the new role.',
            choices: deptArray
        },
    ])
    .then(roleAnswer => {
        const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?,?,?)`
        const params = [roleAnswer.roleName, roleAnswer.roleSalary, roleAnswer.deptName];
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log(roleAnswer.roleName + ' has been added as a role.');
            appOptions();
        }); 
    });
});
};



//Create a function that prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
addEmployee = () => {

    let roleArray = [];

    const sql = `SELECT * FROM role`;
    db.query(sql, (err, response) => {
        if(err) throw err;
        response.forEach((role) => {
            let roleObj = {
                name: role.title,
                value: role.id
            }
            roleArray.push(roleObj);
        },
    )
    });

    const sqlDos = `SELECT * FROM employee`;
    db.query(sqlDos, (err, response) => {
    if(err) throw err;
    let mgrArray = [];
    response.forEach((employee) => {
        let mgrObj = {
            name: employee.last_name + ", " + employee.first_name,
            value: employee.id
        }
        mgrArray.push(mgrObj);
    });

    console.log(`
                =====================
                Adding a New Employee
                =====================
    `);

    return inquirer.prompt([

        {
            type: 'input',
            name: 'empFirstName',
            message: "Please enter the first name of the new employee.",
        },
        {
            type: 'input',
            name: 'empLastName',
            message: "Please enter the last name of the new employee.",
        },
        {
            name: 'roleName',
            type: 'list',
            message: 'Please select the role of the new employee.',
            choices: roleArray
        },
        {
            name: 'mgrName',
            type: 'list',
            message: 'Please select the name of the manager for the new employee.',
            choices: mgrArray
        },
    ])
    .then(empAnswer => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?,?,?, ?)`
        const params = [empAnswer.empFirstName, empAnswer.empLastName, empAnswer.roleName, empAnswer.mgrName];
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log( empAnswer.empFirstName + ' ' + empAnswer.empLastName + 'has been added as an employee.' )
            appOptions();
        }); 
    });
});
};

//Create a function that prompted to select an employee and then prompts the user for the role to update and their new role and this information in the database
updateEmployee = () => {

    const sqlDos = `SELECT * FROM employee`;
    db.query(sqlDos, (err, response) => {
    if(err) throw err;
    let empArray = [];
    response.forEach((employee) => {
        let empObj = {
            name: employee.last_name + ", " + employee.first_name,
            value: employee.id
        }
        empArray.push(empObj);
    });

    let roleArray = [];

    const sql = `SELECT * FROM role`;
    db.query(sql, (err, response) => {
        if(err) throw err;
        response.forEach((role) => {
            let roleObj = {
                name: role.title,
                value: role.id
            }
            roleArray.push(roleObj);
        },
    )
    });

    console.log(`
            ===============================
            Updating a Role for an Employee
            ===============================
    `);

    return inquirer.prompt([

        {
            name: 'empName',
            type: 'list',
            message: 'Please select the employee whose role you wish to update.',
            choices: empArray
        },
        {
            name: 'roleName',
            type: 'list',
            message: 'Please select the new role of this employee.',
            choices: roleArray
        },
    ])
    .then(empRoleAnswer => {
        const sql = `UPDATE employee 
                        SET ?
                        WHERE id = ?`
        const params = [{role_id: empRoleAnswer.roleName}, empRoleAnswer.empName];
        db.query(sql, params, (err, result) => {
            if(err) throw err;
            console.log( 'The role has been updated.' )
            appOptions();
        }); 
    });
});
};

//Start Application
appOptions();