import Event from '../model/eventModel';


// *************** single event by id query ***************

export async function event(parent, args, { id }, info) {

  // find event in db
  return await Event.findOne({ id: id})

  // populate createdBy field with a user and user's events field with events
  .populate({
    path: 'createdBy',
    populate: { path: 'events' }
  })

  // populate comments with users
  .populate({
    path: 'comments.user',
    populate: { path: 'user' },
  });
}


// *************** all events query ***************

export async function events(parent, args, context, info) {

  // find all events in db
  const events = await Event.find({})

  // populate createdBy field with a user and user's events field with events
  .populate({
    path: 'createdBy',
    populate: { path: 'events' }
  })

  // populate comments with users
  .populate({
    path: 'comments.user',
    populate: { path: 'user' },
  });

  return events;
}


// *************** all events in radius of location ***************

export async function eventsInRadius(parent, { radius, location }, context, info) {

  // find all events in radius of location
  const events = await Event.find({
    geometry: {
      $near: {
        $geometry: location,
        $maxDistance: radius, // in meters
      }
    },
    function(err, docs) {
      if (err) return err;
      return docs;
    }
  })

  // populate createdBy field with a user and user's events field with events
  .populate({
    path: 'createdBy',
    populate: { path: 'events' }
  })

  // populate comments with users
  .populate({
    path: 'comments.user',
    populate: { path: 'user' },
  });

  return events;
}