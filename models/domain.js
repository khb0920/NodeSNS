const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model { //인터넷주소, 도메인종류, 클라이언트비밀키 모델
    static init(sequelize){
        return super.init({
            host: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('free', 'premium'),    //ENUM=넣을 수 있는 값을 제한함(free, premium)
                allowNull: false,
            },
            clientSecret: {     //다른 사람들이 이 API를 사용할때 필요한 비밀키
                type: Sequelize.UUID,   //충돌가능성이 매우적은 랜덤한 문자열
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        });
    }

    static associate(db){
        db.Domain.belongsTo(db.User);
    }
};