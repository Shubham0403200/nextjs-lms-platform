const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient()

async function main() {
    try { 
        await database.category.createMany({
            data: [
                {name: "IELTS"},
                {name: "English"},
                {name: "TOEFL"},
                {name: "PTE"},
                {name: "French"},
                {name: "Others"},
            ]
        })

        console.log("success!")
    } catch (error) {
        console.log("error seeding the database categories", error)
    } finally {
        await database.$disconnect();
    }
}

main();