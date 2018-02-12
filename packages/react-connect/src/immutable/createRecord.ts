import { Record, Map } from 'immutable';

const key = '__immutable';
const empty = Map();

export default (name) => class ExtendableRecord extends Record({ [key]: void 0 }, name){
  constructor(immutable){
    super({ [key]: immutable });
    return this;
  };

  get(...args) {
    return super.get<any>(key, empty).get(...args)
  }

  set(...args) {
    const _immutable = super.get<any>(key, empty);
    const upd = _immutable.set(...args)
    return super.set(key, upd)
  }

  update(...args) {
    const _immutable = super.get<any>(key, empty);
    const upd = _immutable.update(...args);
    return super.set(key, upd);
  }

  equals(...args) {
    const _immutable = super.get<any>(key, empty);
    return _immutable.equals(...args);
  }

  hashCode() {
    const _immutable = super.get<any>(key, empty);
    return _immutable.hashCode();
  }

  toJS(){
    const _immutable = super.get<any>(key, empty);
    return _immutable.toJS();
  }

  toObject(){
    return super.get<any>(key, empty).toObject();
  }
}