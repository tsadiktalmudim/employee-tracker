const db = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// utilizing the connection
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database!");
  menu();
});

// Creating menu function for starting the entire inquirer prompt
const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add New Department",
          "Add New Role",
          "Add New Employee",
          "Update Existing Employee",
        ],
      },
    ])
    .then((answers) => {
      let { choice } = answers;

      if (choice === "View Departments") {
        viewDepartment();
      } else if (choice === "View Roles") {
        viewRole();
      } else if (choice === "View Employees") {
        viewEmployee();
      } else if (choice === "Add New Department") {
        addDepartment();
      } else if (choice === "Add New Role") {
        addRole();
      } else if (choice === "Add New Employee") {
        addEmployee();
      } else if (choice === "Update Existing Employee") {
        updateEmployee();
      }
    })
    .catch((err) => {
      if (err) {
        console.log("error");
      } else {
        console.log("done");
      }
    });
};

// Creating the View Department Table function to be called in the inquirer prompt when "View Departments" is chosen
const viewDepartment = () => {
  db.promise()
    .query("SELECT * FROM department")
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

// Creating the View Role Table function to be called in the inquirer prompt when "View Roles" is chosen
const viewRole = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

// Creating the View Employee Table function to be called in the inquirer prompt when "View Employees" is chosen
const viewEmployee = () => {
  db.promise()
  // utilizing template literal to be able to order the query and name the fields as desired
    .query(
      `SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.dept_name AS department,
    role.salary,
    CONCAT (manager.first_name," ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`
    )
    .then(([rows]) => {
      console.table(rows);
      menu();
    });
};

// Creating the Add Department function to be called in the inquirer prompt when "Add New Department" is chosen
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of this department?",
        validate: (foo) => {
          if (foo) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answers) => {
      const { department } = answers;
      db.promise().query(
        `INSERT INTO department (dept_name) VALUES ('${department}')`
      );
      viewDepartment();
    })
    .catch(console.log);
};

// Creating the Add Role function to be called in the inquirer prompt when "Add New Role" is chosen
const addRole = () => {
  db.promise()
    .query("SELECT * FROM department")
    .then(([rows]) => {
      const departments = rows.map(({ dept_name, id }) => ({ name: dept_name, value: id }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the new role?",
            validate: (title) => {
              if (title) {
                return true;
              } else {
                console.log("Please enter a role");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
            validate: (foo) => {
              if (foo) {
                return true;
              } else {
                console.log("Please enter a salary for the role");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "department_id",
            message: "What department does this role belong to?",
            choices: departments,
          },
        ])
        .then((answers) => {
          const params = [answers.title, answers.salary, answers.department_id];
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;

          db.promise()
            .query(sql, params)
            .then(([rows]) => {
              viewRole();
            });
        });
    })
    .catch(console.log);
};

// Creating the Add Employee function to be called in the inquirer prompt when "Add Employee" is chosen
const addEmployee = () => {
  db.promise()
    .query("SELECT * FROM role")
    .then(([rows]) => {
      const roles = rows.map(({ id, title }) => ({ name: title, value: id }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
            validate: (foo) => {
              if (foo) {
                return true;
              } else {
                console.log("Please enter the employee's first name");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
            validate: (foo) => {
              if (foo) {
                return true;
              } else {
                console.log("Please enter the employee's last name");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: roles,
          },
        ])
        .then((answers) => {
          const params = [
            answers.first_name,
            answers.last_name,
            answers.role_id,
          ];

          db.promise()
            .query("SELECT * FROM employee")
            .then(([rows]) => {
              const manager = rows.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager_id",
                    message: "Who is the employee's manager?",
                    choices: manager,
                  },
                ])
                .then((answers) => {
                  const manager = answers.manager_id;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                  db.promise()
                    .query(sql, params)
                    .then(([rows]) => {
                      viewEmployee();
                    });
                });
            });
        });
    })
    .catch(console.log);
};

// Creating the Update Employee function to be called in the inquirer prompt when "Update Existing Employee" is chosen
const updateEmployee = () => {
  db.promise()
    .query("SELECT * FROM employee")
    .then(([rows]) => {
      const employee = rows.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeUpdate",
            message: "Please pick the employee to update",
            choices: employee,
          },
        ])
        .then((answers) => {
          const updateArry = [];
          const employeeId = answers.employeeUpdate;
          // updateArry.push(employeeId)

          db.promise()
            .query(`SELECT * FROM employee WHERE id=${employeeId}`)
            .then((answers) => {
              db.promise()
                .query("SELECT * FROM role")
                .then(([rows]) => {
                  const roles = rows.map(({ title, id }) => ({
                    name: title,
                    value: id,
                  }));

                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "newRole",
                        message: "What is the new role for the employee?",
                        choices: roles,
                      },
                    ])
                    .then((answers) => {
                      const role_id = answers.newRole;
                      const sql = `UPDATE employee SET role_id = ? where id = ?`;

                      updateArry.push(role_id);
                      updateArry.push(employeeId);

                      db.promise()
                        .query(sql, updateArry)
                        .then(({ rows }) => {
                          viewEmployee();
                        });
                    });
                });
            });
        });
    });
};
