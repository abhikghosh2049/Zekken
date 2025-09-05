import React from 'react';

export const ZEKKEN_LOGO = (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="url(#logo-gradient)"/>
      <path d="M13 12L27 12L18 21L27 21L13 28L22 19L13 19L13 12Z" fill="white" fillOpacity="0.9"/>
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5eead4"/>
          <stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
      </defs>
    </svg>
  );

export const PROVIDER_LOGOS: { [key: string]: React.ReactNode } = {
  'Uber': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.268 17.158h-2.536v-4.44h2.536v4.44zm-5.072 0H7.66v-6.976h2.536v6.976zm-2.536-8.254H5.124V4.842h2.536v4.062zM15.804 8.904h-2.536V4.842h2.536v4.062zm-5.072 0H8.196V4.842h2.536v4.062z" />
    </svg>
  ),
  'Ola': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256" fill="none">
        <rect width="256" height="256" fill="black" rx="60"/>
        <path fill="#00A859" d="m147.2 201.2 46.4-81.6-46.4-82H62.8l46.8 82-46.8 81.6h84.4Z"/>
    </svg>
  ),
  'inDrive': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M4.018 4.242C3.56 4.3 3.165 4.694 3.104 5.152L2.01 13.99a.5.5 0 0 0 .616.554l7.98-2.66a.5.5 0 0 0 .37-.37l2.66-7.98a.5.5 0 0 0-.554-.616l-8.838.904Z" fill="#A1DD70"></path>
        <path d="M12.982 7.027a.5.5 0 0 0-.555-.616l-1.424.146.904 8.838a.5.5 0 0 0 .616.554l8.36-1.671a.5.5 0 0 0 .428-.48l.47-4.697a.5.5 0 0 0-.25-.5l-8.55-2.574Z" fill="#A1DD70"></path>
    </svg>
  ),
  'Lyft': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="#FF00BF">
      <path d="M12.4 6.5C12.4 4 11.2 3.1 9.4 3.1c-1.4 0-2.3.9-2.3 2.2 0 .9.5 1.5 1.4 1.9l-1.9 6h2.7l1.1-3.7h.1c.3 1.3 1 3.7 1 3.7h2.4s-.6-2.1-1-3.7c.9-.4 1.5-1.1 1.5-2.2zm-1.6 2.1c-.6 0-1-.3-1-.8s.4-.8 1-.8c.6 0 1 .3 1 .8s-.5.8-1 .8zm4.3-4.3h-2v11.3h2V4.3zm6.3 0h-2v11.3h2V4.3zM4.3 4.3H2.1v11.3h2.2V4.3z" />
    </svg>
  ),
  'Didi': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="#F08C3B">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 13.8c-.44 0-.8-.36-.8-.8s.36-.8.8-.8.8.36.8.8-.36.8-.8.8zm2.4 0c-.44 0-.8-.36-.8-.8s.36-.8.8-.8.8.36.8.8-.36.8-.8.8zm3.5-4.61c-.13-.43-.51-.73-.97-.73H7.47c-.46 0-.84.3-.97.73-.2.64.19 1.33.82 1.52.12.04.25.06.38.06h8.6c.65 0 1.21-.51 1.21-1.16 0-.13-.02-.26-.06-.38z"/>
    </svg>
  ),
};

export const CAB_TYPE_ICONS: { [key: string]: React.ReactNode } = {
  'Sedan': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v5.5c0 .83.67 1.5 1.5 1.5S6 18.33 6 17.5V17h8v.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12l-2.08-5.99zM6.5 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    </svg>
  ),
  'Hatchback': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v5.5c0 .83.67 1.5 1.5 1.5S6 18.33 6 17.5V17h8v.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12l-2.08-5.99zM6.5 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    </svg>
  ),
  'Luxury': (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v5.5c0 .83.67 1.5 1.5 1.5S6 18.33 6 17.5V17h8v.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12l-2.08-5.99zM6.5 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    </svg>
  ),
  'SUV': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17.5,4H2.5C1.12,4,0,5.12,0,6.5v6C0,13.88,1.12,15,2.5,15H4v1.5C4,17.33,4.67,18,5.5,18S7,17.33,7,16.5V15h6v1.5c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5V15h1.5c1.38,0,2.5-1.12,2.5-2.5v-6C20,5.12,18.88,4,17.5,4z M5.5,13C4.67,13,4,12.33,4,11.5S4.67,10,5.5,10s1.5,0.67,1.5,1.5S6.33,13,5.5,13z M14.5,13c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S15.33,13,14.5,13z M18,8H2V6.5h16V8z" clipRule="evenodd"/>
    </svg>
  ),
  'Auto': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
       <path d="M18.39,10.53l-1.42,4.47c-0.2,0.62-0.78,1-1.42,1H14c-1.1,0-2-0.9-2-2v-1H8v1c0,1.1-0.9,2-2,2H4.45 c-0.64,0-1.22-0.38-1.42-1L1.61,10.53C1.04,8.8,2.37,7,4.14,7H15.86C17.63,7,18.96,8.8,18.39,10.53z M6.5,13 C7.33,13,8,12.33,8,11.5S7.33,10,6.5,10S5,10.67,5,11.5S5.67,13,6.5,13z M13.5,13c0.83,0,1.5-0.67,1.5-1.5S14.33,10,13.5,10 S12,10.67,12,11.5S12.67,13,13.5,13z M15,5H5L4,2h12L15,5z"/>
    </svg>
  ),
  'Bike': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15,5c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S16.1,5,15,5z M5,5C3.9,5,3,5.9,3,7s0.9,2,2,2s2-0.9,2-2S6.1,5,5,5z M5,11 c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S6.66,11,5,11z M15,11c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S16.66,11,15,11z M13.97,10.25c-0.44-0.44-1.04-0.67-1.69-0.58l-2.9,0.41c-0.45,0.06-0.8,0.47-0.74,0.92C8.7,11.54,9.26,12,9.8,12h0.4 c0.21,0,0.41-0.07,0.57-0.19l3.35-2.23C14.7,9.15,14.54,8.15,13.97,10.25z"/>
    </svg>
  ),
  'Default': (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v5.5c0 .83.67 1.5 1.5 1.5S6 18.33 6 17.5V17h8v.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V12l-2.08-5.99zM6.5 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
    </svg>
  ),
};

export const PERSON_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);