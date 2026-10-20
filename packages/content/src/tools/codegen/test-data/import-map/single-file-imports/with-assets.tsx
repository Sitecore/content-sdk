import { funco } from '../test-exports';
import styles from './VideoPlayer.module.scss';
import Icon from './logo.svg?url';
import hero from './hero.png';
import { missingThing } from './does-not-exist';

export const value = () => `${funco}${styles}${Icon}${hero}${missingThing}`;
