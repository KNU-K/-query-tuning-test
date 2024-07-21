-- Active: 1695469237026@@127.0.0.1@3306@query_tuning
```
seeds는 seeds/users.js 를 사용
```

DROP TABLE IF EXISTS users;
create table users(
    u_id INT(4) AUTO_INCREMENT NOT NULL,
    email VARCHAR(80) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    PRIMARY key(u_id)
);

-- js 코드를 통해서 dummy-data 입력 100만개 생성
desc users;
select * from users; -- 100만개 기준 - 평균 1.5 sec 

-- ====================전문 scan ===============================
select * from users where email = "Guillermo95@yahoo.com"; -- 100만개 기준 - 평균 750ms


-- ====================Email Optimization ===============================
-- email 을 unique key로 추가를 한다면
ALTER TABLE users ADD UNIQUE(email); 

select * from users where email = "Guillermo95@yahoo.com"; -- 100만개 기준 - 평균 5ms


-- ====================username Optimization ===============================
select * from users where username = "Ila79"; -- 100만개 기준 - 평균 800ms

alter table users add index username_idx(username);

select * from users where username = "Ila79"; -- 100만개 기준 - 평균 7ms


