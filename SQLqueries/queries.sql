SET GLOBAL sql_mode
=
(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

SELECT MONTH(e.expenseDate), e.amount
FROM expenses e
WHERE e.userId=10 AND YEAR(e.expenseDate)=2021
GROUP BY Month(e.expenseDate);

SELECT MONTH(e.expenseDate), 
TRUNCATE
(SUM
(e.amount),2) FROM expenses e WHERE e.userId=10 AND YEAR
(e.expenseDate)=2021 GROUP BY Month
(e.expenseDate);


SELECT MONTH(e.expenseDate), SUM(e.amount)
FROM Expenses e
WHERE e.userId=:userId AND YEAR(e.expenseDate)=:expenseYear
GROUP BY MONTH(e.expenseDate)
