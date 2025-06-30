import React, { useState, useEffect } from "react";
import "./Events.css"; // Assuming you have a CSS file for styling
const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [event, setEvent] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    description: "",
    location: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingEvent
      ? `http://localhost:4000/admin/events/${editingEvent._id}`
      : "http://localhost:4000/admin/events";
    const method = editingEvent ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      if (!response.ok) throw new Error("Failed to save event");

      setEvent({
        eventName: "",
        eventDate: "",
        eventTime: "",
        description: "",
        location: "",
      });
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleEdit = (event) => {
    setEvent(event);
    setEditingEvent(event);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/admin/events/${id}`, {
        method: "DELETE",
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const filteredEvents = events.filter((ev) =>
    searchDate ? ev.eventDate.startsWith(searchDate) : true
  );

  return (
    <div className="event-container">
      <h2 className="event-title">School Events</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <input type="text" name="eventName" placeholder="Event Name" value={event.eventName} onChange={handleChange} required />
        <input type="date" name="eventDate" value={event.eventDate} onChange={handleChange} required />
        <input type="time" name="eventTime" value={event.eventTime} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={event.location} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={event.description} onChange={handleChange}></textarea>
        <button type="submit">{editingEvent ? "Update" : "Add"} Event</button>
      </form>

      <div className="search-bar">
        <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
      </div>

      <div className="event-list">
        {filteredEvents.map((ev) => (
          <div key={ev._id} className="event-card">
            <h3>{ev.eventName}</h3>
            <p>Date: {new Date(ev.eventDate).toLocaleDateString()}</p>
            <p>Time: {ev.eventTime}</p>
            <p>Location: {ev.location}</p>
            <p>Description: {ev.description}</p>
            <button onClick={() => handleEdit(ev)}>Edit</button>
            <button onClick={() => handleDelete(ev._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
