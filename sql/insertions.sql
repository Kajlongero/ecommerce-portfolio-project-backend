INSERT INTO "Permissions" (name) VALUES ('READ_OWN_USER_INFO'), -- 1 -- Read User Info --
('READ_ADMIN_INFO'), -- 2
('READ_CUSTOMER_INFO'), -- 3
('READ_ADMINISTRATIVE_INFO'), -- 4
('READ_INVENTORY_MANAGER_INFO'), -- 5 
('READ_PARTNER_INFO'), -- 6
('READ_VIP_INFO'), -- 7
('READ_ANONYMOUS_INFO'), -- 8
('READ_SESSIONS'), -- 9
('READ_OWN_SESSIONS'), -- 10
('READ_BLACKLISTED_SESSIONS'), -- 11
('READ_OWN_BLACKLISTED_SESSIONS'), -- 12 -- End Read User Info -- -- 
('READ_PERMISSIONS'), -- 13
('READ_ROLE_PERMISSIONS'), -- 14
('READ_PRODUCT_HISTORY'), -- 15
('READ_PRODUCTS_SELLED'), -- 16
('READ_OWN_CART'), -- 17
('READ_ORDERS'), -- 18
('READ_OWN_ORDERS'), -- 19
('READ_ORDER_HISTORY'), -- 20
('READ_OWN_ORDER_HISTORY'), -- 21
('READ_PAYMENTS'), -- 22
('READ_OWN_PAYMENTS'), -- 23
('READ_TICKETS'), -- 24
('READ_OWN_TICKETS'), -- 25
('READ_SUPPORT_ISSUES'), -- 26
('READ_OWN_SUPPORT_ISSUES'), -- 27
('READ_SUPPORT_ISSUES_MESSAGES'), -- 28
('READ_OWN_SUPPORT_ISSUES_MESSAGES'), -- 29
('READ_ISSUES'), -- 30
('READ_OWN_ISSUES'), -- 31
('READ_ISSUES_MESSAGES'), -- 32
('READ_OWN_ISSUES_MESSAGES'), -- 33
('READ_REPORTS'), -- 34
('READ_OWN_REPORTS'),  -- 35
('READ_COMMENTS'), -- 36
('READ_OWN_COMMENTS'), -- 37 
('CREATE_ADMIN'), -- 38 -- Create Users -- -- 
('CREATE_ADMININISTRATIVE'), -- 39
('CREATE_CUSTOMER_SERVICE'), -- 40
('CREATE_INVENTORY_MANAGER'), -- 41
('CREATE_VIP'), -- 42
('CREATE_PARTNER'), -- 43
('CREATE_CUSTOMER'), -- 44
('CREATE_ANONYMOUS'), -- 45 -- End Create Users --
('CREATE_CATEGORY'), -- 46
('CREATE_PRODUCT'), -- 47
('CREATE_ORDER'), -- 48
('CREATE_TICKET'), -- 49
('CREATE_REPORT'), -- 50
('CREATE_ISSUE'), -- 51
('CREATE_ISSUE_MESSAGE'), -- 52
('CREATE_SUPPORT_MESSAGE'), -- 53
('CREATE_SUPPORT_ISSUE_MESSAGE'), -- 54
('CREATE_COMMENT'), -- 55
('CREATE_PAYMENT'),  -- 56 -- Update Users --
('UPDATE_OWN_USER'), -- 57
('UPDATE_ADMIN_USER'), -- 58
('UPDATE_ADMININISTRATIVE_USER'), -- 59
('UPDATE_CUSTOMER_SERVICE_USER'), -- 60
('UPDATE_INVENTORY_MANAGER_USER'), -- 61
('UPDATE_VIP_USER'), -- 62
('UPDATE_PARTNER_USER'), -- 63
('UPDATE_CUSTOMER_USER'), -- 64
('UPDATE_ANONYMOUS_USER'),  -- 65
('UPDATE_USER_ROLE'), -- 66
('UPDATE_CATEGORY'), -- 67
('UPDATE_PRODUCT'), -- 68
('UPDATE_PRODUCT_STATUS'), -- 69
('UPDATE_ORDER'), -- 70
('UPDATE_ORDER_STATUS'), -- 71
('UPDATE_OWN_ORDER_STATUS'), -- 72
('UPDATE_TICKET'), -- 73
('UPDATE_STATUS'), -- 74
('UPDATE_PAYMENT'), -- 75
('UPDATE_OWN_PAYMENT'), -- 76
('UPDATE_OWN_ORDER'), -- 77
('UPDATE_COMMENT'), -- 78
('UPDATE_OWN_COMMENT'), -- 79
('UPDATE_SUPPORT_MESSAGE'), -- 80
('UDPATE_OWN_SUPPORT_MESSAGE'), -- 81
('UPDATE_SUPPORT_STATUS'), -- 82
('UPDATE_ISSUE_STATUS'), -- 83
('DELETE_OWN_USER'), -- 84 -- Delete Users -- 
('DELETE_ADMIN'), -- 85
('DELETE_CUSTOMER_SERVICE'), -- 86
('DELETE_ADMINISTRATIVE'), -- 87
('DELETE_INVENTORY_MANAGER'), -- 88
('DELETE_CUSTOMER'), -- 89
('DELETE_PARTNER'), -- 90
('DELETE_VIP'), -- 91
('DELETE_SESSIONS'), -- 92
('DELETE_OWN_SESSIONS'), -- 93 -- End Users Delete -- 
('DELETE_PRODUCT'), -- 94
('DELETE_CATEGORY'), -- 95
('DELETE_ORDER'), -- 96
('DELETE_OWN_ORDER'), -- 97
('DELETE_TICKET'), -- 98
('DELETE_OWN_TICKET'), -- 99
('DELETE_PRODUCT_HISTORY'), -- 100
('DELETE_PRODUCT_SELLED'), -- 101
('DELETE_PRODUCT_IMAGE'), -- 102
('DELETE_COMMENT'), -- 103
('DELETE_OWN_COMMENT'), -- 104
('DELETE_SUPPORT_MESSAGE'), -- 105
('DELETE_OWN_SUPPORT_MESSAGE'), -- 106
('DELETE_ISSUE'), -- 107
('DELETE_OWN_ISSUE'), -- 108
('ADD_PRODUCT_IMAGES'), -- 109 -- add --
('ASSIGN_ADMIN_ROLE'), -- 110 -- ASSIGN --
('ASSIGN_CUSTOMER_SERVICE_ROLE'), -- 111
('ASSIGN_ADMINISTRATIVE_ROLE'), -- 112
('ASSIGN_INVENTORY_MANAGER_ROLE'), -- 113
('ASSIGN_CUSTOMER_ROLE'), -- 114
('ASSIGN_PARTNER_ROLE'), -- 115
('ASSIGN_VIP_ROLE'); -- 116

INSERT INTO "Roles" (name) VALUES
('OWNER'),
('ADMIN'),
('ADMINISTRATIVE'),
('CUSTOMER_SERVICE'),
('INVENTORY_MANAGER'),
('CUSTOMER'),
('VIP'),
('PARTNER'),
('ANONYMOUS');

--ONWER--
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(48, 1),
(49, 1),
(50, 1),
(51, 1),
(52, 1),
(53, 1),
(54, 1),
(55, 1),
(56, 1),
(57, 1),
(58, 1),
(59, 1),
(60, 1),
(61, 1),
(62, 1),
(63, 1),
(64, 1),
(65, 1),
(66, 1),
(67, 1),
(68, 1),
(69, 1),
(70, 1),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(77, 1),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 1),
(89, 1),
(90, 1),
(91, 1),
(92, 1),
(93, 1),
(94, 1),
(95, 1),
(96, 1),
(97, 1),
(98, 1),
(99, 1),
(100, 1),
(101, 1),
(102, 1),
(103, 1),
(104, 1),
(105, 1),
(106, 1),
(107, 1),
(108, 1),
(109, 1),
(110, 1),
(111, 1),
(112, 1),
(113, 1),
(114, 1),
(115, 1),
(116, 1);

-- ADMIN --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 2),
(12, 2),
(13, 2),
(14, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(31, 2),
(32, 2),
(33, 2),
(34, 2),
(44, 2),
(52, 2),
(54, 2),
(55, 2),
(62, 2),
(63, 2),
(64, 2),
(65, 2),
(78, 2),
(79, 2),
(80, 2),
(81, 2),
(82, 2),
(83, 2),
(89, 2),
(90, 2),
(91, 2),
(92, 2),
(93, 2),
(103, 2),
(104, 2),
(105, 2),
(106, 2),
(107, 2),
(114, 2),
(115, 2),
(116, 2);

-- ADMINISTRATIVE --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 3),
(3, 3),
(6, 3),
(7, 3),
(8, 3),
(15, 3),
(16, 3),
(18, 3),
(20, 3),
(22, 3),
(24, 3),
(26, 3),
(28, 3),
(29, 3),
(30, 3),
(32, 3),
(33, 3),
(34, 3),
(36, 3),
(37, 3),
(42, 3),
(43, 3),
(44, 3),
(46, 3),
(47, 3),
(48, 3),
(49, 3),
(52, 3),
(53, 3),
(54, 3),
(55, 3),
(56, 3),
(57, 3),
(62, 3),
(63, 3),
(64, 3),
(67, 3),
(68, 3),
(69, 3),
(70, 3),
(71, 3),
(73, 3),
(74, 3),
(75, 3),
(78, 3),
(79, 3),
(80, 3),
(81, 3),
(82, 3),
(83, 3),
(89, 3),
(90, 3),
(91, 3),
(94, 3),
(95, 3),
(96, 3),
(100, 3),
(101, 3),
(102, 3),
(103, 3),
(104, 3),
(105, 3),
(106, 3),
(107, 3),
(108, 3),
(109, 3),
(114, 3),
(115, 3),
(116, 3);

-- CUSTOMER SERVICE --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 4),
(10, 4),
(12, 4),
(30, 4),
(32, 4),
(34, 4),
(36, 4),
(37, 4),
(52, 4),
(53, 4),
(54, 4),
(55, 4),
(57, 4),
(80, 4),
(82, 4),
(83, 4),
(103, 4),
(104, 4),
(105, 4),
(106, 4),
(107, 4);

-- INVENTORY MANAGER --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 5),
(10, 5),
(12, 5),
(15, 5),
(16, 5),
(20, 5),
(24, 5),
(36, 5),
(37, 5),
(47, 5),
(55, 5),
(68, 5),
(69, 5),
(78, 5),
(79, 5),
(94, 5),
(100, 5),
(101, 5),
(103, 5),
(104, 5);

-- CUSTOMER --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 6),
(10, 6),
(12, 6),
(19, 6),
(21, 6),
(23, 6),
(25, 6),
(27, 6),
(28, 6),
(29, 6),
(31, 6),
(32, 6),
(33, 6),
(35, 6),
(36, 6),
(37, 6),
(48, 6),
(50, 6),
(51, 6),
(52, 6),
(53, 6),
(54, 6),
(55, 6),
(57, 6),
(72, 6),
(76, 6),
(77, 6),
(79, 6),
(81, 6),
(84, 6),
(93, 6),
(97, 6),
(99, 6),
(104, 6),
(106, 6),
(108, 6);

-- VIP --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 7),
(10, 7),
(12, 7),
(19, 7),
(21, 7),
(23, 7),
(25, 7),
(27, 7),
(28, 7),
(29, 7),
(31, 7),
(32, 7),
(33, 7),
(35, 7),
(36, 7),
(37, 7),
(48, 7),
(50, 7),
(51, 7),
(52, 7),
(53, 7),
(54, 7),
(55, 7),
(57, 7),
(72, 7),
(76, 7),
(77, 7),
(79, 7),
(81, 7),
(84, 7),
(93, 7),
(97, 7),
(99, 7),
(104, 7),
(106, 7),
(108, 7);

-- PARTNER --
INSERT INTO "_PermissionsToRoles" ("A", "B") VALUES (1, 8),
(10, 8),
(12, 8),
(19, 8),
(21, 8),
(23, 8),
(25, 8),
(27, 8),
(28, 8),
(29, 8),
(31, 8),
(32, 8),
(33, 8),
(35, 8),
(36, 8),
(37, 8),
(48, 8),
(50, 8),
(51, 8),
(52, 8),
(53, 8),
(54, 8),
(55, 8),
(57, 8),
(72, 8),
(76, 8),
(77, 8),
(79, 8),
(81, 8),
(84, 8),
(93, 8),
(97, 8),
(99, 8),
(104, 8),
(106, 8),
(108, 8);