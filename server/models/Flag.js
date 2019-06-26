import FlagServices from '../services/flagServices';

const flagService = new FlagServices();
class Flag {
  constructor({
    id, propertyId, description, reason, createdOn,
  }) {
    this.id = id;
    this.property_id = propertyId;
    this.reason = reason;
    this.description = description;
    this.created_on = createdOn;
  }
}
export { Flag, flagService };
