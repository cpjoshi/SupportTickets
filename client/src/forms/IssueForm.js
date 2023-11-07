// IssueForm.js
import * as microsoftTeams from '@microsoft/teams-js';
import React, { useState, useEffect } from 'react';
import '../style/IssueForm.css';
import defaultIcon from '../default-image.svg';
import {Priority, Status} from '../models/FormsModel';
import DropDown from '../components/DropDown';

const IssueForm = ({ onSave, onClose, selectedIssue, actionHandler }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    // If a selected issue is provided, populate the form fields
    if (selectedIssue) {
      setDescription(selectedIssue.description || '');
      setPriority(selectedIssue.priority || '');
      setStatus(selectedIssue.status || '');
      setImage(selectedIssue.image || null);
    }
  }, [selectedIssue]);

  const handleSave = () => {
    const updatedIssue = {
      id: selectedIssue ? selectedIssue.id : generateUniqueId(),
      description,
      priority,
      status,
      image
    };

    onSave(updatedIssue);
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const selectImage = () => {
    microsoftTeams.media.selectMedia(
      {
        mediaType: microsoftTeams.media.MediaType.Image,
        maxMediaCount: 1,
        imageMaxWidth: 200,
        imageMaxHeight: 200
      },
      (error, attachments) => {
        if (error) {
          console.error('Error selecting image:', error);
          alert('Error selecting image:' + error)
          return;
        }

        if (attachments.length === 0) {
          console.log('No image attachment received');
          return;
        }

        const attachment = attachments[0];
        var src = "data:" + attachment.mimeType + ";base64," + attachment.preview;
        setImage(src);
      }
    );
  };

  return (
    <div className='issue-form-container' >
      <h2>{selectedIssue ? 'Update Issue' : 'Create New Issue'}</h2>
      
      <div className="issue-form-body">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="priority">Priority:</label>
        <DropDown id="priority" options={Priority} onChange={(e) => setPriority(e.target.value)}/>

        <label htmlFor="status">Status:</label>
        <DropDown id="status" options={Status} onChange={(e) => setStatus(e.target.value)}/>
        
        <div>
          <label htmlFor="image">Image:</label>
          <div className="image-container" onClick={(e) => selectImage(e.target.value)}>
            <img id="image" className='image-box' src={image || defaultIcon} alt="Issue"/>
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default IssueForm;
