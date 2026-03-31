import { Game } from '../game.js';
import { event } from '../config/events.js';
import { MenuState } from '../states/menu.state.js';
import { GameOverState } from '../states/game-over.state.js';
import { ResultsState } from '../states/results.state.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stateOf = (game: Game) => (game as any).state;

describe('Game state machine', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game({} as CanvasRenderingContext2D);
  });

  it('initializes with MenuState', () => {
    expect(stateOf(game)).toBeInstanceOf(MenuState);
  });

  it('transitions to GameOverState', () => {
    game.changeState(event.state.GAME_OVER);
    expect(stateOf(game)).toBeInstanceOf(GameOverState);
  });

  it('transitions to ResultsState', () => {
    game.changeState(event.state.RESULTS);
    expect(stateOf(game)).toBeInstanceOf(ResultsState);
  });

  it('calls exit on old state during transition', () => {
    const exitSpy = vi.spyOn(MenuState.prototype, 'exit');
    game.changeState(event.state.GAME_OVER);
    expect(exitSpy).toHaveBeenCalledOnce();
    exitSpy.mockRestore();
  });

  it('calls start on new state during transition', () => {
    const startSpy = vi.spyOn(GameOverState.prototype, 'start');
    game.changeState(event.state.GAME_OVER);
    expect(startSpy).toHaveBeenCalledOnce();
    startSpy.mockRestore();
  });

  it('warns on unknown state name', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    game.changeState('nonexistent');
    expect(warnSpy).toHaveBeenCalledWith('Unknown state: nonexistent');
    warnSpy.mockRestore();
  });

  it('re-subscribes to CHANGE_STATE allowing successive transitions', () => {
    game.changeState(event.state.GAME_OVER);
    game.changeState(event.state.MENU);
    expect(stateOf(game)).toBeInstanceOf(MenuState);
  });

  it('handles RESTART cascade to MenuState', () => {
    game.changeState(event.state.RESTART);
    expect(stateOf(game)).toBeInstanceOf(MenuState);
  });
});
