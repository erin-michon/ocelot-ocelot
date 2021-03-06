INSERT INTO department (name)
  VALUES
  ('Master Data Management'),
  ('IM Clearing House'),
  ('Plant Stores Supervisors');

INSERT INTO role (title, salary, department_id)
  VALUES
  ('MDM Manager', '57000.00', '1'),
  ('IM Clearing House Manager', '55000.00', '2'),
  ('Work Chain Analyst','50000.00', '2'),
  ('Spare Part Coordinator','50000.00', '1'),
  ('Specification Gatekeeper','50000.00', '1'),
  ('Catalog Gatekeeper','40000.00', '1'),
  ('Catalog Analyst','55000.00', '1'),
  ('MTO Coordinator','50000.00', '1'),
  ('Stores Supervisor','45000.00', '3');

INSERT INTO employee (first_name, last_name, role_id, manager_id )
    VALUES
    ('Erin', 'Carson', '1', NULL),
    ('Cora', 'Peterson', '2', NULL),
    ('Paulette', 'Stein', '1', '1'),
    ('Bill', 'Brown', '3', '2'),
    ('Tom', 'Arthur', '7', '1'),
    ('Terry', 'Johnson', '4', '1'),
    ('Brent', 'Gregory', '3', '1'),
    ('Kevin', 'McConnell', '6', '1'),
    ('Trey', 'Fishman', '5', '1'),
    ('Mike', 'Gordon', '8', '1'),
    ('Page', 'Farmhouse', '9', '3');