import React from 'react';
import { createRoot } from 'react-dom/client';
import ContactReact from './ContactReact.jsx';

export class ContactSection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.root = null;
  }

  play() {
    if (!this.container) return;
    
    if (this.root) {
      this.root.unmount();
    }
    
    this.root = createRoot(this.container);
    this.root.render(React.createElement(ContactReact));
  }
}
