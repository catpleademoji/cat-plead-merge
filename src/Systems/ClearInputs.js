export default function ClearInputs() {
  this.query = [];
  this.update = (time, entities, state) => {
    state.mouse_down = false;
    state.horizontal = 0;
  };
}