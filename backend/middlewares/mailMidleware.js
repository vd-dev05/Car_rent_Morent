import CarModel from "../models/CarModel.js";

const MailMidleware = {
    validateCar: async (req, res, next) => {
        try {
            const {carId} = req.query;
            const car = await CarModel.findById(carId);
            if (car.isStatus === 'pending') throw new Error('Xe chưa đăng bán, không thể gửi đơn!');
            next();
        } catch (error) {
            res.status(500).send({
                message: error.message,
                data: null,
            });
        }
    },
}

export default MailMidleware