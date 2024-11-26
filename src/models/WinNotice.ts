import { DataTypes, Model, type Optional } from 'sequelize';
import sequelize from '../utils/db';

interface WinNoticeAttributes {
    id: string;
    bidId: string;
    price: number;
    adId: string;
}

interface WinNoticeCreationAttributes extends Optional<WinNoticeAttributes, 'id'> {}

class WinNotice extends Model<WinNoticeAttributes, WinNoticeCreationAttributes> implements WinNoticeAttributes {
    public id!: string;
    public bidId!: string;
    public price!: number;
    public adId!: string;
}

WinNotice.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bidId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        adId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'win_notices',
    }
);

export default WinNotice;