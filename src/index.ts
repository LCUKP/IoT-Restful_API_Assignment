import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { pool } from "./db.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.get(
  "/",
  serveStatic({
    path: "./public/index.html",
  })
);

//เพิ่มข้อมูลนักศึกษา
app.post("/api/v1/students", async (c) => {
  try {
    const body = await c.req.json();

    const {
      firstName,
      lastName,
      studentId,
      birthDate,
      gender,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !studentId ||
      !birthDate ||
      !gender
    ) {
      return c.json(
        { message: "All fields are required" },
        400
      );
    }

    const result = await pool.query(
      `INSERT INTO students
       (first_name, last_name, student_id, birth_date, gender)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [firstName, lastName, studentId, birthDate, gender]
    );

    return c.json(
      {
        message: "Student created successfully",
        data: result.rows[0],
      },
      201
    );
  } catch (error: any) {
    if (error.code === "23505") {
      return c.json(
        { message: "Student ID already exists" },
        409
      );
    }

    console.error(error);

    return c.json(
      { message: "Internal server error" },
      500
    );
  }
});

// ดึงข้อมูลนักศึกษาทั้งหมด
app.get("/api/v1/students", async (c) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id ASC"
    );

    return c.json({
      message: "Students retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      { message: "Internal server error" },
      500
    );
  }
});

// ดึงข้อมูลนักศึกษารายคน
app.get("/api/v1/students/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return c.json({ message: "Invalid student ID" }, 400);
    }

    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return c.json(
        { message: "Student not found" },
        404
      );
    }

    return c.json({
      message: "Student retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return c.json(
      { message: "Internal server error" },
      500
    );
  }
});

// UPDATE ข้อมูลนักศึกษา
app.put("/api/v1/students/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return c.json({ message: "Invalid student ID" }, 400);
    }

    const body = await c.req.json();

    const {
      firstName,
      lastName,
      studentId,
      birthDate,
      gender,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !studentId ||
      !birthDate ||
      !gender
    ) {
      return c.json(
        { message: "All fields are required" },
        400
      );
    }

    const result = await pool.query(
      `UPDATE students
       SET first_name = $1,
           last_name = $2,
           student_id = $3,
           birth_date = $4,
           gender = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [firstName, lastName, studentId, birthDate, gender, id]
    );

    if (result.rows.length === 0) {
      return c.json(
        { message: "Student not found" },
        404
      );
    }

    return c.json({
      message: "Student updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return c.json(
        { message: "Student ID already exists" },
        409
      );
    }

    console.error(error);

    return c.json(
      { message: "Internal server error" },
      500
    );
  }
});

//ลบข้อมูลนักศึกษา
app.delete("/api/v1/students/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return c.json({ message: "Invalid student ID" }, 400);
    }

    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return c.json(
        { message: "Student not found" },
        404
      );
    }

    return c.json({
      message: "Student deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return c.json(
      { message: "Internal server error" },
      500
    );
  }
});

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port,
  },
  (info) => {
    console.log(`Server is running on port ${info.port}`);
  }
);