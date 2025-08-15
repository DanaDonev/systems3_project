const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  timezone: 'local'
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log('Connection established');
})

let dataPool = {}

dataPool.getUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM User
      WHERE Id = ?
    `;
    conn.query(sql, [userId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
// GET A USER
dataPool.AuthUser = (email) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User WHERE Email = ?', [email], (err, res, fields) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })

}

dataPool.deleteUser = (UserId) => {
  return new Promise((resolve, reject) => {
    conn.query('DELETE FROM User WHERE Id = ?', [UserId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// GET A USER
dataPool.FindUser = (email) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User WHERE Email = ?', [email], (err, res, fields) => {
      if (err) { return reject(err) }
      return resolve(res)
    });
  });

}

// ADD A USER
dataPool.AddUser = (name, surname, username, password, email, phone, dob, address, city, userType) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO User (Name,Surname,Username,Password, City, Email, DOB, Address, PhoneNo, Role) VALUES (?,?,?,?,?,?,?,?,?,?)`, [name, surname, username, password, city, email, dob, address, phone, userType], (err, res) => {
      console.log("Adding user: " + name);
      if (err) {
        console.log("ERROR: " + err.message);
        return reject(err);
      }
      return resolve(res)
    })
  })
}

dataPool.AddVet = (navetClinic, vetProof, email) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Vet (Clinic, Proof, UserEmail) VALUES (?,?,?)`, [navetClinic, vetProof, email], (err, res) => {
      console.log("Adding vet: " + navetClinic);
      if (err) {
        console.log("ERROR: " + err.message);
        return reject(err);
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
    conn.query('SELECT * FROM Post LEFT JOIN Comment ON Post.Id = Comment.QId', (err, res) => {
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
    conn.query('SELECT * FROM Post LEFT JOIN Comment ON Post.Id = Comment.QId WHERE Post.Pet = ?', [pet], (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

dataPool.checkUserHasActiveDeals = (userId) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Deal WHERE OwnerId = ? OR ServerId = ?', [userId, userId], (err, res) => {
      if (err) return reject(err);
      resolve(res.length > 0);
    });
  });
};

dataPool.getPostsWithCommentsAndUserByPetAndCategory = (pet, category, limit, offset) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        Post.*, 
        Comment.Id AS CommentId, 
        Comment.Content AS CommentContent, 
        Comment.Timestamp AS CommentTimestamp, 
        Comment.UserId AS CommentUserId, 
        User.Username AS CommentUsername
      FROM Post
      LEFT JOIN Comment ON Post.Id = Comment.QId
      LEFT JOIN User ON Comment.UserId = User.Id
      WHERE Post.Pet = ? AND Post.Category = ?
      ORDER BY Post.Timestamp DESC, Comment.Timestamp ASC
      LIMIT ? OFFSET ?
    `;
    conn.query(sql, [pet, category, limit, offset], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
dataPool.getPostsFinal = (pet, category, limit, offset, sortBy) => {
  return new Promise((resolve, reject) => {
    // Determine ORDER BY clause based on sortBy
    let orderByClause = "Timestamp DESC";
    if (sortBy === "oldest") {
      orderByClause = "Timestamp ASC";
    } else if (sortBy === "mostComments") {
      orderByClause = "CommentCount DESC";
    } else if (sortBy === "leastComments") {
      orderByClause = "CommentCount ASC";
    } else if (sortBy === "newest") {
      orderByClause = "Timestamp DESC";
    }
    console.log('offset: ' + offset);
    console.log(sortBy);


    let whereClause = "Post.Pet = ?";
    let params = [pet];
    if (category && category !== "") {
      whereClause += " AND Post.Category = ?";
      params.push(category);
    }
    // Step 1: Get limited list of posts WITH author info and comment count
    const getPostsSQL = `
      SELECT * FROM (
        SELECT 
          Post.*, 
          User.Username AS AuthorUsername,
          (SELECT COUNT(*) FROM Comment WHERE Comment.QId = Post.Id) AS CommentCount
        FROM Post
        JOIN User ON Post.UserId = User.Id
        WHERE ${whereClause}
      ) AS Q
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;
    conn.query(getPostsSQL, [...params, Number(limit), Number(offset)], (err, posts) => {
      if (err) return reject(err);
      if (posts.length === 0) return resolve([]); // No posts found

      const postIds = posts.map(q => q.Id);
      console.log('postIds: ' + postIds);


      // Step 2: Get related comments and users
      const getCommentsSQL = `
        SELECT 
          Comment.Id AS CommentId, 
          Comment.CDescription AS CommentContent, 
          Comment.QId AS PostId,
          Comment.UserId AS CommentUserId,
          Comment.Timestamp AS CommentTimestamp,
          U.Username AS CommentUsername
        FROM Comment
        LEFT JOIN User U ON Comment.UserId = U.Id
        WHERE Comment.QId IN (${postIds.length ? postIds.map(() => '?').join(',') : 'NULL'})
        ORDER BY Comment.Timestamp ASC
      `;

      conn.query(getCommentsSQL, postIds, (err, comments) => {
        if (err) return reject(err);
        console.log('postIds: ' + postIds);
        // Step 3: Map comments to posts
        const postMap = {};
        posts.forEach(q => {
          postMap[q.Id] = {
            id: q.Id,
            timestamp: q.Timestamp,
            description: q.Question,
            photo: q.Photo ? q.Photo.toString('base64') : null,
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
          if (postMap[c.PostId]) {
            postMap[c.PostId].comments.push({
              id: c.CommentId,
              content: c.CommentContent,
              timestamp: c.CommentTimestamp,
              username: c.CommentUsername
            });
          }
        });
        console.log('postIds: ' + Object.values(postMap).id);
        const orderedPosts = postIds.map(id => postMap[id]).filter(Boolean);
        console.log('orderedPosts: ' + orderedPosts);
        resolve(orderedPosts);
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
      INSERT INTO Post 
        (Timestamp, Question, Photo, Type, UserId, Pet, Category)
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

dataPool.addListing = ({ periodFrom, periodTo, petType, description, price, userId }) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Listing (PeriodFrom, PeriodTo, PetType,Description, Price,  UserId)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    conn.query(sql, [periodFrom, periodTo, petType, description, price, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.getPet = (pet, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM Pet
      WHERE Name = ? AND UserId = ?
    `;
    conn.query(sql, [pet, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.allListings = (sortBy) => {
  let orderByClause = "PeriodFrom";
  if (sortBy === "price") {
    orderByClause = "Price";
  } else if (sortBy === "rating") {
    orderByClause = "Rating DESC";
  }

  return new Promise((resolve, reject) => {
    conn.query(`
      SELECT Listing.*, User.City, User.Username, User.Email, User.PhoneNo, R.Rating
      FROM Listing
      JOIN User ON Listing.UserId = User.Id
      LEFT JOIN (
        SELECT UserId,AVG(Rate) AS Rating
        FROM Review
        GROUP BY UserId
      ) AS R ON Listing.UserId = R.UserId
      ORDER BY ${orderByClause}
    `, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

dataPool.deleteListing = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Listing WHERE Id = ?`;
    conn.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

dataPool.deletePost = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Post WHERE Id = ?`;
    conn.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

dataPool.deleteComment = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Comment WHERE Id = ?`;
    conn.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

dataPool.addDeal = ({ timeFrom, timeTo, price, food, description, userId, serverId, petId }) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      INSERT INTO Deal (TimeStamp, TimeFrom, TimeTo, Price, Food, Description, OwnerId, ServerId, PetId, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    conn.query(sql, [now, timeFrom, timeTo, price, food, description, userId, serverId, petId, 'sent'], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// get posts by pet and category with pagination
dataPool.getPostsByPetAndCategory = (pet, category) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        Post.*, 
        Comment.Id AS CommentId, 
        Comment.Content AS CommentContent, 
        Comment.Timestamp AS CommentTimestamp, 
        Comment.UserId AS CommentUserId, 
        User.Username AS CommentUsername
      FROM Post
      LEFT JOIN Comment ON Post.Id = Comment.QId
      LEFT JOIN User ON Comment.UserId = User.Id
      WHERE Post.Pet = ? AND Post.Category = ?
      ORDER BY Post.Timestamp DESC, Comment.Timestamp ASC
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
      SELECT * FROM Post
      LEFT JOIN Comment ON Post.Id = Comment.QId
      WHERE Post.Pet = ? AND Post.Category = ?
      ORDER BY Post.Timestamp DESC
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
  if (!category) {
    return new Promise((resolve, reject) => {
      const sql = `
      SELECT COUNT(*) AS count
      FROM Post
      WHERE Pet = ?
    `;
      conn.query(sql, [pet], (err, res) => {
        if (err) return reject(err);
        resolve(res[0].count);
      });
    });
  }
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM Post
      WHERE Pet = ? AND Category = ?
    `;
    conn.query(sql, [pet, category], (err, res) => {
      if (err) return reject(err);
      resolve(res[0].count);
    });
  });
};

//getCommentsByPostIds

// dataPool.getCommentsByPostIds = (QId) => {
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
dataPool.getCommentsByPostIds = (QIds) => {
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

// get pets per user
dataPool.getPetsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Pet
      WHERE UserId = ?
    `;
    conn.query(sql, [userId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// get posts by pet
dataPool.getPostsByPet = (pet) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Post
      WHERE Pet = ?
    `;
    conn.query(sql, [pet], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

// Store a new reset token
dataPool.StoreResetToken = (UserId, Token, ExpiresIn) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO PasswordResetTokens (UserId, Token, ExpiresIn) VALUES (?, ?, ?)";
    conn.query(sql, [UserId, Token, ExpiresIn], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Find user by reset token
dataPool.FindUserByResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.* FROM User u
      JOIN PasswordResetTokens prt ON u.Id = prt.UserId
      WHERE prt.Token = ? AND prt.ExpiresIn > ?
      LIMIT 1
    `;
    conn.query(sql, [token, Date.now()], (err, results) => {
      if (err) return reject(err);
      resolve(results && results.length > 0 ? results[0] : null);
    });
  });
};

// Delete a reset token (after use)
dataPool.DeleteResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM PasswordResetTokens WHERE Token = ?";
    conn.query(sql, [token], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.UpdateUserPassword = (userId, password) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE User SET Password = ? WHERE Id = ?";
    conn.query(sql, [password, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.getUserPets = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Pet
      WHERE UserId = ?
    `;
    conn.query(sql, [userId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.getPetsitterRating = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT AVG(Rate)
      FROM Review
      WHERE UserId = ?
      GROUP BY UserId
    `;
    conn.query(sql, [userId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.saveDealRating = (dealId, rating, description) => {
  return new Promise((resolve, reject) => {
    // Step 1: Get ServerId from Deal
    const selectSql = "SELECT ServerId, OwnerId FROM Deal WHERE Id = ?";
    conn.query(selectSql, [dealId], (selectErr, selectResult) => {
      if (selectErr) return reject(selectErr);

      if (!selectResult.length) {
        return reject(new Error("Deal not found"));
      }

      const serverId = selectResult[0].ServerId;
      const ownerId = selectResult[0].OwnerId;

      const insertSql = `
        INSERT INTO Review (CreatorId, UserId, Rate, Date, Description) 
        VALUES (?, ?, ?, NOW(), ?)
      `;
      conn.query(
        insertSql,
        [ownerId, serverId, rating, description],
        (insertErr, insertResult) => {
          if (insertErr) return reject(insertErr);
          resolve(insertResult);
        }
      );
    });
  });
};


dataPool.getPetsitterReviews = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Review
      WHERE UserId = ?
    `;
    conn.query(sql, [userId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.updateDealStatus = (dealId, status) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Deal SET Status = ? WHERE Id = ?";
    conn.query(sql, [status, dealId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.updateUser = (userId, profileForm) => {
  //         const profileForm: {
  //     Name: string;
  //     Surname: string;
  //     Username: string;
  //     Email: string;
  //     PhoneNo: string;
  //     DOB: string;
  //     Address: string;
  //     City: string;
  //     Role: string;
  // }
  return new Promise((resolve, reject) => {
    const sql = "UPDATE User SET ? WHERE Id = ?";
    conn.query(sql, [profileForm, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.checkIfVet = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Vet WHERE UserEmail = ? and IsApproved = 1";
    conn.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0 ? true : false); // Return true if vet exists and is approved else false
    });
  });
};

dataPool.updatePet = (Id, petData) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Pet SET ? WHERE Id = ?";
    conn.query(sql, [petData, Id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

dataPool.getUserEmail = (dealId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT User.Email
      FROM User
      JOIN Deal ON User.Id = Deal.OwnerId
      WHERE Deal.Id = ?
    `;
    conn.query(sql, [dealId], (err, res) => {
      if (err) return reject(err);
      resolve(res[0] ? res[0].Email : null);
    });
  });
};

dataPool.getPetSitterByDealId = (dealId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT User.*
      FROM User
      JOIN Deal ON User.Id = Deal.ServerId
      WHERE Deal.Id = ?
    `;
    conn.query(sql, [dealId], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.getDealsThatEndsToday = () => {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().slice(0, 10);
    const sql = `
      SELECT *
      FROM Deal
      WHERE DATE(TimeTo) = ?
      AND Status = 'accepted'
    `;
    conn.query(sql, [today], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

module.exports = dataPool;