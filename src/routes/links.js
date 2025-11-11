const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', async (req, res) => {
   res.render('links/add');
});

router.post('/add', async (req, res) => {
   const { title, url, description } = req.body;
   const newLinks = {
      title,
      url,
      description
   }
   await pool.query('INSERT INTO links SET ?', [newLinks]);
   req.flash('success', 'Link saved successfully');
   
   // Guardar sesión antes de redirigir
   req.session.save((err) => {
      if (err) {
         console.error('Error guardando sesión:', err);
      }
      res.redirect('/links');
   });
});

router.get('/', async (req, res) => {
  const links = await pool.query('SELECT * FROM links');
  res.render('links/list', {links});
});

//delete
router.get('/delete/:id', async (req, res) => {
   const { id } = req.params;
   await pool.query('DELETE FROM links WHERE id = ?', [id]);
   req.flash('success', 'Link deleted successfully');
   
   req.session.save((err) => {
      if (err) {
         console.error('Error guardando sesión:', err);
      }
      res.redirect('/links');
   });
}); 

//edit
router.get('/edit/:id', async (req, res) => { 
   const { id } = req.params;
   try {
      const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
      const link = links[0];
      if (!link) {
         req.flash('error', 'Link not found');
         return res.redirect('/links');
      }
      res.render('links/edit', { link });
   } catch (error) {
      console.error('Error al obtener link:', error);
      req.flash('error', 'Error loading link');
      res.redirect('/links');
   }
});

router.post('/edit/:id', async (req, res) => {
   const { id } = req.params;
   const { title, url, description } = req.body;
   const updatedLink = {
      title,
      url,
      description
   };
   try {
      await pool.query('UPDATE links SET ? WHERE id = ?', [updatedLink, id]);
      req.flash('success', 'Link updated successfully');
      
      req.session.save((err) => {
         if (err) {
            console.error('Error guardando sesión:', err);
         }
         res.redirect('/links');
      });
   } catch (error) {
      console.error('Error al actualizar:', error);
      req.flash('error', 'Error updating link');
      
      req.session.save((err) => {
         if (err) {
            console.error('Error guardando sesión:', err);
         }
         res.redirect('/links/edit/' + id);
      });
   }
});

module.exports = router;