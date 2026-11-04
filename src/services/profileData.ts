// Fictional profiles for own mode (Aanya) and match mode (Rohan)
type Row = { icon: string; label: string; value: string };
export type Section = { title: string; rows: Row[] };
export type Profile = {
  name: string; age: number; gender: string; height: string; education: string; profession: string; location: string; bio: string;
  about: Section[]; lifestyle: Section[]; family: Section[];
};

export const PROFILES: Record<string, Profile> = {
  u_aanya: {
    name: 'Aanya', age: 27, gender: 'Female', height: `5'4"`, education: 'MBA', profession: 'Marketing Manager', location: 'Mumbai',
    bio: 'I enjoy travelling, cooking and quiet evenings with a good book. Looking for someone kind and curious.',
    about: [
      { title: 'Personal Details', rows: [
        { icon: 'person-outline', label: 'Name', value: 'Aanya' }, { icon: 'location-outline', label: 'City', value: 'Mumbai' },
        { icon: 'language-outline', label: 'Languages', value: 'Hindi, English, Marathi' } ] },
      { title: 'Education & Career', rows: [
        { icon: 'school-outline', label: 'Education', value: 'MBA' }, { icon: 'briefcase-outline', label: 'Profession', value: 'Marketing Manager' } ] },
    ],
    lifestyle: [
      { title: 'Lifestyle & Interests', rows: [
        { icon: 'restaurant-outline', label: 'Food', value: 'Vegetarian' }, { icon: 'airplane-outline', label: 'Travel', value: 'Mountains and heritage towns' },
        { icon: 'color-palette-outline', label: 'Hobbies', value: 'Painting, cooking' }, { icon: 'musical-notes-outline', label: 'Music', value: 'Indie, classical' },
        { icon: 'film-outline', label: 'Movies & Shows', value: 'Drama, documentaries' }, { icon: 'fitness-outline', label: 'Fitness', value: 'Yoga, 4 times a week' } ] },
      { title: 'Daily Routine', rows: [
        { icon: 'sunny-outline', label: 'Wake up', value: '6:30 AM' }, { icon: 'laptop-outline', label: 'Work', value: '9:30 AM to 6:00 PM' },
        { icon: 'moon-outline', label: 'Evening', value: 'Walk, cook, read' }, { icon: 'calendar-outline', label: 'Weekends', value: 'Family and friends' } ] },
    ],
    family: [
      { title: 'Family Background', rows: [
        { icon: 'home-outline', label: 'Family type', value: 'Nuclear' }, { icon: 'people-outline', label: 'Siblings', value: 'One elder sister' } ] },
      { title: 'Family Involvement', rows: [
        { icon: 'chatbubbles-outline', label: 'Involvement', value: 'Family joins at the right stage' } ] },
    ],
  },
  c_rohan: {
    name: 'Rohan', age: 29, gender: 'Male', height: `5'10"`, education: 'B.Tech', profession: 'Software Engineer', location: 'Bengaluru',
    bio: 'Engineer by day, trekker on weekends. I value honesty and good conversation.',
    about: [
      { title: 'Personal Details', rows: [
        { icon: 'person-outline', label: 'Name', value: 'Rohan' }, { icon: 'location-outline', label: 'City', value: 'Bengaluru' },
        { icon: 'language-outline', label: 'Languages', value: 'English, Kannada, Hindi' } ] },
      { title: 'Education & Career', rows: [
        { icon: 'school-outline', label: 'Education', value: 'B.Tech' }, { icon: 'briefcase-outline', label: 'Profession', value: 'Software Engineer' } ] },
    ],
    lifestyle: [
      { title: 'Lifestyle & Interests', rows: [
        { icon: 'restaurant-outline', label: 'Food', value: 'Eats everything' }, { icon: 'airplane-outline', label: 'Travel', value: 'Treks and road trips' },
        { icon: 'color-palette-outline', label: 'Hobbies', value: 'Photography' }, { icon: 'musical-notes-outline', label: 'Music', value: 'Rock, folk' },
        { icon: 'film-outline', label: 'Movies & Shows', value: 'Thrillers' }, { icon: 'fitness-outline', label: 'Fitness', value: 'Running' } ] },
      { title: 'Daily Routine', rows: [
        { icon: 'sunny-outline', label: 'Wake up', value: '7:00 AM' }, { icon: 'laptop-outline', label: 'Work', value: '10:00 AM to 7:00 PM' },
        { icon: 'moon-outline', label: 'Evening', value: 'Gym, dinner' }, { icon: 'calendar-outline', label: 'Weekends', value: 'Treks and friends' } ] },
    ],
    family: [
      { title: 'Family Background', rows: [
        { icon: 'home-outline', label: 'Family type', value: 'Joint' }, { icon: 'people-outline', label: 'Siblings', value: 'One younger brother' } ] },
      { title: 'Family Involvement', rows: [
        { icon: 'chatbubbles-outline', label: 'Involvement', value: 'Family consulted on big decisions' } ] },
    ],
  },
};

export const PREFERENCE_SECTIONS = [
  { icon: 'options-outline', title: 'Basic', desc: 'Age, height, location' },
  { icon: 'cafe-outline', title: 'Lifestyle', desc: 'Food, habits and routine' },
  { icon: 'home-outline', title: 'Family', desc: 'Family type and values' },
  { icon: 'compass-outline', title: 'Values & Outlook', desc: 'What matters most to you' },
  { icon: 'add-circle-outline', title: 'Additional Preferences', desc: 'Anything else you would like to add' },
];