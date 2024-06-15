import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import ImageSide from '../images/image_side.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ScheduleComponent, Inject, Day, Week, WorkWeek, Month, Agenda } from '@syncfusion/ej2-react-schedule';
import { format } from 'date-fns';

function Calendar() {
    const [events, setEvents] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3002/")
            .then(res => {
                console.log(res.data);
                if (res.data.valid) {
                    // Stocker l'ID utilisateur dans le sessionStorage
                    sessionStorage.setItem('userId', res.data.id);
                    navigate('/calendar');
                } else {
                    navigate('/login');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login');
            });
    }, [navigate]);

    const handleActionComplete = (args) => {
        if (args.requestType === 'eventCreated') {
            console.log("Event data received:", args);
            const eventData = args.data[0]; // On ajoute un événement à la fois, donc on prend le premier élément
            const { Subject, Description, StartTime, EndTime, Location } = eventData;

            // Vérifier si toutes les données nécessaires sont présentes
            if (!Subject || !StartTime || !EndTime || !Location) {
                console.error("Incomplete event data:", eventData);
                return;
            }

            // Formater les dates
            const formattedStartTime = format(new Date(StartTime), 'yyyy-MM-dd HH:mm:ss');
            const formattedEndTime = format(new Date(EndTime), 'yyyy-MM-dd HH:mm:ss');

            console.log("Event details to be sent:", {
                subject: Subject,
                description: Description,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                location: Location,
            });

            // Récupérer l'ID utilisateur du sessionStorage
            const userId = sessionStorage.getItem('userId');

            // Envoyer les données à votre API backend pour enregistrer l'événement
            axios.post("http://localhost:3002/api/add-event", {
                userId: userId, // Utiliser l'ID utilisateur du sessionStorage
                title: Subject,
                description: Description,
                start: formattedStartTime,
                end: formattedEndTime,
                location: Location,
            })
            .then(res => {
                console.log("Event added successfully to the database:", res.data);
                fetchEvents(); // Actualiser les événements après l'ajout
            })
            .catch(err => {
                console.error("Error adding event to the database:", err);
            });
        }
    };

    const fetchEvents = () => {
        axios.get("http://localhost:3002/api/events")
            .then(res => {
                setEvents(res.data);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des événements :", err);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const data = events.map(event => ({
        Id: event.IDEVENT,
        Subject: event.TITRE,
        StartTime: new Date(event.DATE_DEBUT),
        EndTime: new Date(event.DATE_FIN),
        IsAllDay: false,
        Status: 'Completed',
        Priority: 'High'
    }));

    const fieldsData = {
        id: 'Id',
        subject: { name: 'Subject' },
        isAllDay: { name: 'IsAllDay' },
        startTime: { name: 'StartTime' },
        endTime: { name: 'EndTime' }
    };

    const eventSettings = { dataSource: data, fields: fieldsData };

    return (
        <div className='main-margin'>
            <Row className="calendar">
                <Col>
                    <h1>Calendrier de Béthel</h1>
                    <ScheduleComponent
                        width='80%'
                        height='700px'
                        className='scheduler'
                        eventSettings={eventSettings}
                        actionComplete={handleActionComplete}
                        firstDayOfWeek={1}
                    >
                        <Inject services={[Day, Week, Month, Agenda]} />
                    </ScheduleComponent>
                </Col>
                <Col xs lg="2">
                    <img className="image_side" src={ImageSide} alt="sideimage"></img>
                </Col>
            </Row>
        </div>
    );
}

export default Calendar;
