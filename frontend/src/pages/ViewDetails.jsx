import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewDetails.css";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const ViewDetails = () => {
    const { id } = useParams();  // ✅ Get subjectId from the URL
    const [files, setFiles] = useState([]); // 🔹 Separate state for files
    const [links, setLinks] = useState([]); // 🔹 Separate state for links
    //const [resources, setResources] = useState([]); // Store uploaded resources
    const [subtopics, setSubtopics] = useState([]); // Store notes
    const [newSubtopic, setNewSubtopic] = useState(""); // Input field for notes
    const [selectedFile, setSelectedFile] = useState(null);
    const [resourceLink, setResourceLink] = useState("");

    const API_URL = "https://study-buddy-backend-two.vercel.app/api/resources"; // Update based on your backend URL


// Fetch existing resources on page load
useEffect(() => {
    const fetchResources = async () => {
        if (!id) {
            console.error("subjectId is missing!");
            return;
        }
        try {
            const token = localStorage.getItem("token");  // Get token
            if (!token) {
                console.error("No authentication token found!");
                return;
            }
            const response = await axios.get(`https://study-buddy-backend-two.vercel.app/api/resources/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Send token
                },
                withCredentials: true, 
            });
            
            // 🔹 Separate files and links
            const allFiles = response.data.filter(res => res.resourceType === "file");
            const allLinks = response.data.filter(res => res.resourceType === "link");

            setFiles(allFiles);
            setLinks(allLinks);

            // setResources(response.data); // ✅ Store fetched data in state
            // console.log("Fetched Resources:", response.data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    };
    fetchResources();
}, [id]);  // Make sure subjectId is available

const fetchFiles = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });

        setFiles(response.data); // ✅ Update the UI with latest files
    } catch (error) {
        console.error("Error fetching files:", error);
    }
};

useEffect(() => {
    fetchFiles();
}, []);


// 🔹 Upload a file
const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("subject", id);

    try {
        const token = localStorage.getItem("token"); 

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });

        if (response.data) {
            // ✅ Fetch updated file list after upload
            fetchFiles();
           // setFiles(prevFiles => [...prevFiles, response.data]); // ✅ Instant update
        }

        setSelectedFile(null);
    } catch (error) {
        console.error("Error uploading file:", error.response?.data || error.message);
    }
};

const fetchLinks = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });

        setLinks(response.data); // ✅ Update the UI with latest links
    } catch (error) {
        console.error("Error fetching links:", error);
    }
};

useEffect(() => {
    fetchLinks();
}, []);


const handleLinkUpload = async () => {
    if (!resourceLink.trim()) return alert("Enter a valid link");

    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/add-link`,
            { subject: id, link: resourceLink },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        if (response.data) {
            // ✅ Fetch updated link list after upload
            fetchLinks();
        }

        setResourceLink("");
    } catch (error) {
        console.error("Error uploading link:", error);
    }
};


    // 🔹 Delete an Individual File
    const handleDeleteFile = async (fileId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setFiles(files.filter(file => file._id !== fileId));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    // 🔹 Delete an Individual Link
    const handleDeleteLink = async (linkId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/${linkId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setLinks(links.filter(link => link._id !== linkId));
        } catch (error) {
            console.error("Error deleting link:", error);
        }
    };

    // 🔹 Clear All Files
    const handleClearAllFiles = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setFiles([]); // 🔹 Clear state
        } catch (error) {
            console.error("Error clearing files:", error);
        }
    };

    // 🔹 Clear All Links
    const handleClearAllLinks = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setLinks([]); // 🔹 Clear state
        } catch (error) {
            console.error("Error clearing links:", error);
        }
    };

    // 🔹 Add a new subtopic
    const handleAddSubtopic = () => {
        if (!newSubtopic) return alert("Enter a subtopic");
        
        setSubtopics(prev => [...prev, { text: newSubtopic, completed: false }]);
        //setSubtopics([...subtopics, { text: newSubtopic, completed: false }]);
        setNewSubtopic("");
    };

    // 🔹 Delete a subtopic
    const handleDeleteSubtopic = (index) => {
        setSubtopics(subtopics.filter((_, i) => i !== index));
    };

    // 🔹 Toggle completed status
    const handleToggleComplete = (index) => {
        const updatedSubtopics = [...subtopics];
        updatedSubtopics[index].completed = !updatedSubtopics[index].completed;
        setSubtopics(updatedSubtopics);
    };

    // 🔹 Clear all subtopics
    const handleClearAll = () => {
        setSubtopics([]);
    };
    return (
        
        <div className="view-details-page">
        <div className="container">
            <h2>Subject Details</h2>
    
            {/* 🔹 Two-Column Layout for Upload Sections */}
            <div className="upload-container">
                <div className="upload-section">
                    <h3>Upload File</h3>
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <button onClick={handleFileUpload}>Upload File</button>
                </div>
    
                <div className="upload-section">
                    <h3>Upload Link</h3>
                    <input type="text" placeholder="Paste link here" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} />
                    <button onClick={handleLinkUpload}>Upload Link</button>
                </div>
            </div>
    
            {/* 🔹 Two-Column Layout for Uploaded Sections */}
            <div className="uploaded-container">
                <div className="uploaded-section">
                    <h3>Uploaded Files</h3>
                    <ul>
                        {files
                            .filter(file => file.fileURL)
                            .map((file, index) => {
                                const fileName = decodeURIComponent(file.fileURL.split("/").pop());
                                return (
                                    <li key={file._id || index}>
                                        <a href={`http://localhost:5000${file.fileURL}`} target="_blank" rel="noopener noreferrer">
                                            {fileName}
                                        </a>
                                        <button className="delete-btn" onClick={() => handleDeleteFile(file._id)}>
    <FontAwesomeIcon icon={faTrash} />
</button>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
    
                <div className="uploaded-section">
                    <h3>Uploaded Links</h3>
                    <ul>
                        {links
                            .filter(link => link.link)
                            .map(link => (
                                <li key={link._id || link.link}>
                                    <a href={link.link} target="_blank" rel="noopener noreferrer">
                                        {decodeURIComponent(link.link)}
                                    </a>
                                    <button className="delete-btn" onClick={() => handleDeleteLink(link._id)}>
    <FontAwesomeIcon icon={faTrash} />
</button>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
    
            {/* 🔹 Notes Section */}
            <div className="notes-container">
                <h3>Keep Notes</h3>
                <div>
                    <input type="text" placeholder="Enter a subtopic" value={newSubtopic} onChange={(e) => setNewSubtopic(e.target.value)} />
                    <button onClick={handleAddSubtopic}>Add</button>
                    <button onClick={handleClearAll}>Clear All</button>
                </div>
    
                <ul>
                    {subtopics.map((subtopic, index) => (
                        <li key={index} style={{ textDecoration: subtopic.completed ? "line-through" : "none" }}>
                            <input type="checkbox" checked={subtopic.completed} onChange={() => handleToggleComplete(index)} />
                            {subtopic.text}
                            <button className="delete-btn" onClick={() => handleDeleteSubtopic(index)}>
    <FontAwesomeIcon icon={faTrash} />
</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </div>
    );
    
};

export default ViewDetails;
