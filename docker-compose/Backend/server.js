import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello, World!" });
});

app.get("/api/data", (req, res) => {
    const data = {
        id: 1,
        name: "Sample Data",
    }
    res.status(200).json(data);
})

app.get("/api/users", (req, res) => {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
    ]
    res.status(200).json(users);
})

app.get("*name", (req, res)=>{
    res.sendFile("public/index.html", { root: __dirname });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});