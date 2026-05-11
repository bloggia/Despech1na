import { MainTheme } from './types';

export const GAME_THEMES: MainTheme[] = [
  {
    id: 'tatuajes',
    title: 'El Tatuaje',
    subThemes: [
      { id: 't-1', title: 'Tribal en la pierna', description: 'Encuentra a alguien con un tribal en la pierna.', points: 10, completed: false, type: 'tattoo' },
      { id: 't-2', title: 'Cara', description: 'Tatuaje en la cara (valiente!).', points: 20, completed: false, type: 'tattoo' },
      { id: 't-3', title: 'Letras en el cuello', description: 'Letras o nombres en el cuello.', points: 15, completed: false, type: 'tattoo' },
      { id: 't-4', title: 'Serpiente en el antebrazo', description: 'Un clásico: la serpiente.', points: 10, completed: false, type: 'tattoo' },
      { id: 't-5', title: 'Daga', description: 'Encuentra una daga punzante.', points: 15, completed: false, type: 'tattoo' },
    ]
  },
  {
    id: 'conocimiento',
    title: '¿Cuánto conoces a Esteban?',
    subThemes: [
      { id: 'e-1', title: 'El Ombligo', description: 'Halla el ombligo de Esteban.', points: 10, completed: false, type: 'trivia' },
      { id: 'e-2', title: 'La Nuca', description: '¿Cuál es la nuca de tu amado?', points: 10, completed: false, type: 'trivia' },
      { id: 'e-3', title: 'El Diente', description: 'Un primer plano dental.', points: 10, completed: false, type: 'trivia' },
      { id: 'e-4', title: 'El Talón', description: 'Pisando fuerte.', points: 10, completed: false, type: 'trivia' },
      { id: 'e-5', title: 'El Entrecejo', description: 'Esos pelos rebeldes.', points: 10, completed: false, type: 'trivia' },
    ]
  },
  {
    id: 'memes',
    title: 'El Meme Viral',
    subThemes: [
      { id: 'm-1', title: 'Shrek', description: 'Recrea al ogro más famoso. (Ref: https://bit.ly/shrek-meme)', points: 20, completed: false, type: 'meme' },
      { id: 'm-2', title: 'Megan', description: 'El baile de la muñeca. (Ref: https://bit.ly/megan-meme)', points: 20, completed: false, type: 'meme' },
      { id: 'm-3', title: 'Perro Triste', description: 'Esa carita... (Ref: https://bit.ly/sad-dog-meme)', points: 20, completed: false, type: 'meme' },
      { id: 'm-4', title: 'Gato Devastado', description: 'Llorando por dentro. (Ref: https://bit.ly/sad-cat-meme)', points: 20, completed: false, type: 'meme' },
      { id: 'm-5', title: 'Calamardo Tentáculos', description: 'El humor de lunes. (Ref: https://bit.ly/squidward-meme)', points: 20, completed: false, type: 'meme' },
    ]
  },
  {
    id: 'tatuadora',
    title: 'La Tatuadora Social',
    subThemes: [
      { id: 's-1', title: 'Chico Calvo', description: 'Ponle una calcomanía en la calva.', points: 15, completed: false, type: 'social' },
      { id: 's-2', title: 'Chico/a en el culo', description: '¡Atrévete!', points: 25, completed: false, type: 'social' },
      { id: 's-3', title: 'Señor/a mayor', description: 'Con todo el respeto.', points: 20, completed: false, type: 'social' },
      { id: 's-4', title: 'Niño/a', description: 'Con permiso de los padres.', points: 15, completed: false, type: 'social' },
      { id: 's-5', title: 'Policía', description: 'El reto máximo.', points: 50, completed: false, type: 'social' },
    ]
  }
];
