INSERT INTO department (dept_name)
VALUES
    ("Sales"),
    ("Accounting"),
    ("Software Engineering");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Lead Software Engineer", 120000, 3),
    ("Software Engineer", 85000, 3),
    ("Accounting Manager", 120000, 2),
    ("Accountant", 72000, 2),
    ("Sales Manager", 130000, 1),
    ("Sales Agent", 35000, 1);

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Devin", "Hickson", 1, null),
    ("George", "Gino III", 5, null),
    ("Lisa", "Kudrow", 3, null),
    ("Minnie", "Hatfield", 5, 2),
    ("Shayna", "Rourke", 2, 1),
    ("Ben", "Stein", 2, 1),
    ("Tiffany", "Sorenson", 4, 3),
    ("Kumail", "Patel", 6, 2),
    ("Monica", "Padman", 6, 2);