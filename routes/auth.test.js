const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');
const { describe } = require('../models/user');
const req = require('express/lib/request');

beforeAll(async () => {     //현재 테스트실행전에 수행되는 코드
    await sequelize.sync(); //데이터베이스 테이블 생성
});

describe('POST /join', () => {
    test('로그인 안 했으면 회원가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'smr1995@naver.com',
                nick: 'khb',
                password: '123',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

describe('POST /login', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'smr1995@naver.com',
                nick: 'khb',
                password: '123',
            })
            .end(done);
    });

    test('이미 로그인 했으면 리다이렉팅', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다');
        agent
            .post('/auth/join')
            .send({
                email: 'smr1995@naver.com',
                nick: 'khb',
                password: '123',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('가입되지 않은 회원', async (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'smr1995@naver.com',
                password: '123',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

    test('로그인 수행', async (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'smr1995@naver.com',
                password: '123',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
    
    test('비밀번호 틀림', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다');
        req(app)
            .post('/autj/login')
            .send({
                email: 'smr1995@naver.com',
                password: 'wrongpw',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });
});

describe('GET /logout', () => {
    test('로그인 되어있지 않으면 403', async (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'smr1995@naver.com',
                password: '123',
            })
            .end(done);
    });

    test('로그아웃 수행', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다');
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done);
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });
});
