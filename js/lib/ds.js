// Designsystemet är en färdigbyggd bundle (js/design-system.js) som förväntar
// sig ett globalt React. ES-moduler körs i importordning, så react-global.js
// hinner sätta window.React innan bundlen laddas.
import './react-global.js';
import '../design-system.js';

export const DS = window.BrelioDesignSystem_2b4fd5;
