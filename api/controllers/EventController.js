const Event = require('../models/event');
const Profile = require('../models/profil');


const EventController =  {
    getEvent: async (req, res) => {
        try {
            const evenements = await Event.find();
            res.json(evenements);
        } catch(error) {
            res.status(500).json({message: "Internal Server Error" });
        }
    
    },
    getEventId: async (req, res) => {
        try {
            const {id}  = req.params;
            const event = await Event.findById(id);
            if(!event) {
                res.status(404).json({message: "Event not found"});
            }
            res.json(event);
        }
         catch(error) {
            res.status(500).json({message: "Internal Server ERROR"});
        }
    },
    getEventUserId: async (req, res) => {
        try {
            const userId = req.params.userId;

    // Récupérez tous les événements pour un utilisateur spécifique
        const events = await Event.find({ user: userId });

        return res.status(200).json(events);
        }
        catch(error) {
            console.error('Erreur lors de la récupération des événements:', error);
            res.status(500).json({message: "Internal Server Error"});
        }
    },

    AddEvent: async (req,res) => {
       try {
            const { title, description, date, responsable } = req.body;
            console.log(title,description,date,responsable);
            // Vérifiez si l'utilisateur existe avant de créer l'événement
            const user = await Profile.findById(responsable);
            if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Créez l'événement
            const event = new Event({
            title,
            description,
            date,
            user: `${user.name + ' ' +  user.surname}`,
            });

    // Enregistrez l'événement dans la base de données
            await event.save();

            return res.status(201).json(event);
        } catch (error) {
            console.error('Erreur lors de la creation de l\'événement :', error);
            res.status(500).json({ error: 'Erreur lors de la creation de l\'événement' });
        }
       
    },
    UpdateEvent: async(req, res) => {
        try {
            const event = await Event.findByIdAndUpdate(
              req.params.eventId,
              { $set: { status: 'terminé' } },
              { new: true }
            );
        
            if (!event) {
              return res.status(404).json({ error: 'Événement non trouvé' });
            }
        
            res.json(event);
          } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'événement :', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
          }
    }
}

module.exports = EventController;
