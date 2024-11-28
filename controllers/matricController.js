const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Save Matric Number
const saveMatricNumber = async (req, res) => {
  try {
    const { matricNum } = req.body;
    const newMatric = await prisma.matricNumber.create({
      data: { matricNum },
    });
    res.status(201).json(newMatric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Matric Numbers
const getMatricNumbers = async (req, res) => {
  try {
    const matrics = await prisma.matricNumber.findMany();
    res.status(200).json(matrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveMatricNumber, getMatricNumbers };
