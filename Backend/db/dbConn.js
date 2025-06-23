const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log('Connection established');
})

let dataPool = {}

// GET A USER
dataPool.AuthUser=(username)=>
{
  return new Promise ((resolve, reject)=>{
    conn.query('SELECT * FROM User WHERE Name = ?', [username], (err,res, fields)=>{
      if(err){return reject(err)}
      return resolve(res)
    })
  })  
	
}

// ADD A USER
dataPool.AddUser=(name,surname,username,email,password,phone,dob,address,city)=>{
  return new Promise ((resolve, reject)=>{
    conn.query(`INSERT INTO User (Name,Surname,Username,Password, City, Email, DOB, Address, PhoneNo) VALUES (?,?,?,?,?,?,?,?,?)`, [name,surname,username,password, city, email, dob, address, phone], (err,res)=>{
      console.log("Adding user: " + name);
      if(err){return reject(err);
        console.log("ERROR: " + err.message);
      }
      return resolve(res)
    })
  })
}

// get all users
dataPool.allUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User', (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};


// get all posts with their comments
dataPool.allPosts = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Question LEFT JOIN Comment ON Question.Id = Comment.QId', (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

// get posts by pet
dataPool.getPostsByPet = (pet) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Question LEFT JOIN Comment ON Question.Id = Comment.QId WHERE Question.Pet = ?', [pet], (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

dataPool.getPostsWithCommentsAndUserByPetAndCategory = (pet, category, limit, offset) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        Question.*, 
        Comment.Id AS CommentId, 
        Comment.Content AS CommentContent, 
        Comment.Timestamp AS CommentTimestamp, 
        Comment.UserId AS CommentUserId, 
        User.Username AS CommentUsername
      FROM Question
      LEFT JOIN Comment ON Question.Id = Comment.QId
      LEFT JOIN User ON Comment.UserId = User.Id
      WHERE Question.Pet = ? AND Question.Category = ?
      ORDER BY Question.Timestamp DESC, Comment.Timestamp ASC
      LIMIT ? OFFSET ?
    `;
    conn.query(sql, [pet, category, limit, offset], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.getPostsFinal = (pet, category, limit, offset) => {
  return new Promise((resolve, reject) => {
    // Step 1: Get limited list of questions WITH author info
    const getQuestionsSQL = `
      SELECT 
        Question.*, 
        User.Username AS AuthorUsername
      FROM Question
      JOIN User ON Question.UserId = User.Id
      WHERE Question.Pet = ? AND Question.Category = ?
      ORDER BY Question.Timestamp DESC
      LIMIT ? OFFSET ?
    `;

    conn.query(getQuestionsSQL, [pet, category, limit, offset], (err, questions) => {
      if (err) return reject(err);
      if (questions.length === 0) return resolve([]); // No posts found

      const questionIds = questions.map(q => q.Id);

      // Step 2: Get related comments and users
      const getCommentsSQL = `
        SELECT 
          Comment.Id AS CommentId, 
          Comment.CDescription AS CommentContent, 
          Comment.QId AS QuestionId,
          Comment.UserId AS CommentUserId,
          Comment.Timestamp AS CommentTimestamp,
          U.Username AS CommentUsername
        FROM Comment
        LEFT JOIN User U ON Comment.UserId = U.Id
        WHERE Comment.QId IN (?)
        ORDER BY Comment.Timestamp ASC
      `;

      conn.query(getCommentsSQL, [questionIds], (err, comments) => {
        if (err) return reject(err);

        // Step 3: Map comments to questions
        const questionMap = {};
        questions.forEach(q => {
          questionMap[q.Id] = { 
            id: q.Id,
            timestamp: q.Timestamp,
            description: q.QDescription,
            photo: q.Photo.toString('base64'),
            type: q.Type,
            pet: q.Pet,
            category: q.Category,
            author: {
              id: q.UserId,
              username: q.AuthorUsername
            },
            comments: []
          };
        });

        comments.forEach(c => {
          if (questionMap[c.QuestionId]) {
            questionMap[c.QuestionId].comments.push({
              id: c.CommentId,
              content: c.CommentContent,
              timestamp: c.CommentTimestamp,
              username: c.CommentUsername
            });
          }
        });

        resolve(Object.values(questionMap));
      });
    });
  });
};
dataPool.addCommentToPost = (postId, userId, comment) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Comment (QId, UserId, CDescription, Timestamp)
      VALUES (?, ?, ?, NOW())
    `;
    conn.query(sql, [postId, userId, comment], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.createPost = (postData) => {
  return new Promise((resolve, reject) => {
    const { description, photoBuffer, type, userId, pet, category } = postData;

    const sql = `
      INSERT INTO Question 
        (Timestamp, QDescription, Photo, Type, UserId, Pet, Category)
      VALUES
        (NOW(), ?, ?, ?, ?, ?, ?)
    `;

    conn.query(sql, [description, photoBuffer, type, userId, pet, category], (err, result) => {
      if (err) return reject(err);

      // Return the inserted post id
      //resolve({ insertedId: result.insertId });
      resolve();
    });
  });
};



// get posts by pet and category
// dataPool.getPostsByPetAndCategory = (pet, category) => {
//   return new Promise((resolve, reject) => {
//     conn.query('SELECT * FROM Question LEFT JOIN Comment ON Question.Id = Comment.QId WHERE Question.Pet = ? AND Question.Category = ?', [pet, category], (err, res) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(res);
//     });
//   });
// };

// get posts by pet and category with pagination
dataPool.getPostsByPetAndCategory = (pet, category) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        Question.*, 
        Comment.Id AS CommentId, 
        Comment.Content AS CommentContent, 
        Comment.Timestamp AS CommentTimestamp, 
        Comment.UserId AS CommentUserId, 
        User.Username AS CommentUsername
      FROM Question
      LEFT JOIN Comment ON Question.Id = Comment.QId
      LEFT JOIN User ON Comment.UserId = User.Id
      WHERE Question.Pet = ? AND Question.Category = ?
      ORDER BY Question.Timestamp DESC, Comment.Timestamp ASC
    `;
    conn.query(sql, [pet, category], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
dataPool.getPostsByPetAndCategoryPaginated = (pet, category, limit, offset) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM Question
      LEFT JOIN Comment ON Question.Id = Comment.QId
      WHERE Question.Pet = ? AND Question.Category = ?
      ORDER BY Question.Timestamp DESC
      LIMIT ? OFFSET ?
    `;
    conn.query(sql, [pet, category, limit, offset], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// count posts by pet and category
dataPool.countPostsByPetAndCategory = (pet, category) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM Question
      WHERE Pet = ? AND Category = ?
    `;
    conn.query(sql, [pet, category], (err, res) => {
      if (err) return reject(err);
      resolve(res[0].count);
    });
  });
};

//getCommentsByQuestionIds

// dataPool.getCommentsByQuestionIds = (QId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT * 
//     FROM Comment
//     WHERE QId IN (?)`;
//     conn.query(sql, [QId], (err, res) => {
//       if (err) return reject(err);
//       resolve(res);
//     });
//   });
// };
dataPool.getCommentsByQuestionIds = (QIds) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(QIds) || QIds.length === 0) {
      return resolve([]); // Return empty array if no IDs provided
    }
    const placeholders = QIds.map(() => '?').join(',');
    const sql = `SELECT * FROM Comment WHERE QId IN (${placeholders})`;
    conn.query(sql, QIds, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};


module.exports = dataPool;