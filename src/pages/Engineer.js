import React, { useEffect, useState} from "react";
import Sidebar from "../componenets/Sidebar"
import TicketsCard from "../componenets/TicketsCard";
import fetchTickets from "../utils/fetchTickets"; 
import updateTicketCounts from "../utils/updateTicketCounts";
import '../styles/engineer.css';
import axios from "axios";
import TicketTable from "../componenets/TicketTable";
import EditTicketModal from"../componenets/EditTicketModal";

const BASE_URL = process.env.REACT_APP_SERVER_URL

function Engineer() {
    const [ticketUpdateModal, setTicketUpadteModal] = useState(false)
    const [ticketStatusCount, setTicketStatusCount] = useState({
        open: 0,
        closed: 0,
        in_progress: 0,
        blocked: 0,
        total: 1
        })
        const [message, setMessage] = useState("")
        const [ticketDetails, setTicketDetails] = useState([])
        const [selectedTicket, setSeletedTicket] = useState({})

        const fetchAndUpdateTickets = async () => {
            let tickets = await fetchTickets(localStorage)
            updateTicketCounts(tickets, setTicketStatusCount)
            setTicketDetails(tickets)
        }

        useEffect(() => {
            (async () => {
               await fetchAndUpdateTickets()
           })()
        },[]) 

        const closeTicketUpdationModal = () => setTicketUpadteModal(false)
        const editTicket = (ticket) => {
            const ticketCopy = {...ticket}
            setSeletedTicket(ticketCopy)
            setTicketUpadteModal(true)
        }
        const onTicketUpdate = (e) => {
            if(e.target.name === 'title') 
            selectedTicket.title = e.target.value
            else if(e.target.name === 'description')
                 selectedTicket.description = e. target.value
            else if(e.target.name === "status")
                 selectedTicket.status = e.target.value
            else if(e.target.name === "ticketPriority")
                 selectedTicket.ticketPriority = e.target.value
            setSeletedTicket({ ...selectedTicket })            
        }

        const updateTicket = (e) => {
            e.preventDefault()
            axios.put(BASE_URL + '/crm/api/tickets/' + selectedTicket.id, selectedTicket, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            }, {
                'userId' :localStorage.getItem("userId")
            }).then (
                (response) => {
                    setMessage("Ticket Updated Successfully")
                    closeTicketUpdationModal();
                    fetchAndUpdateTickets()
                }
            ).catch(
                (error) => {
                    if (error.status === 400)
                      setMessage(error.message)
                    else if(error.status === 400)
                      setMessage("Authorization error, retry logging in")
                    closeTicketUpdationModal()
                    console.log(error.message)                    
                }
            )
        }

    return (
        <div className="bg-light">
            <div className="col-1"><Sidebar home= '/'/></div>
            <div className="container vh-100">
                <div className="pt-4">
                <h3 className="text-primary text-center">Welcome {localStorage.name},</h3>
                <p className="text-muted text-center">Take a  look at your dashboard.</p>
                </div>
                {/* cards */}
                <div className="row my-4 mx-2 text-center">
                   {/* Open */}
                    <TicketsCard 
                    color='bg-primary' 
                    icon='bi-pencil' 
                    type= 'open' 
                    count = {ticketStatusCount.open} 
                    total={ticketStatusCount.total}
                    borders = 'borders-b'  />

                {/* In Progress */}
                <TicketsCard 
                    color='bg-warning' 
                    icon='bi-lightning-charge' 
                    type= 'In Progress' 
                    count = {ticketStatusCount.in_progress} 
                    total={ticketStatusCount.total}  
                    borders = 'borders-y'  />

                {/* Closed */}
                <TicketsCard 
                    color='bg-success' 
                    icon='bi-check2-circle' 
                    type= 'Closed' 
                    count = {ticketStatusCount.closed} 
                    total={ticketStatusCount.total}  
                    borders = 'borders-g'  />

                    {/* Blocked */}
                    <TicketsCard 
                    color='bg-secondery' 
                    icon='bi-slash-circle' 
                    type= 'Blocked' 
                    count = {ticketStatusCount.blocked} 
                    total={ticketStatusCount.total}  
                    borders = 'borders-grey'  />
                    
                </div>
                <hr />
                <p className="text-success">{message}</p>
                <TicketTable 
                   editTicket = {editTicket}
                   ticketDetails = {ticketDetails}
                />
                {
                    ticketUpdateModal? (
                        <EditTicketModal 
                        show={ticketUpdateModal}
                        onHide={closeTicketUpdationModal}
                        selectedTicket={selectedTicket}
                        updateTicket={updateTicket}
                        onTicketUpdate={onTicketUpdate}
                        />
                    ): (
                        ""
                        )
                }
                </div>
            </div>
    );
}

export default Engineer;