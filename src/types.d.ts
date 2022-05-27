export interface IAutocompleteItem {
    primaryText: string;
    secondaryText?: string;
    value: string;
}

export interface IConfig {
    readonly type: string = "custom:datetime-card";
    entities?: IEntity[] = [];
    image?: string;
    title?: string;
    show_names: boolean;
}

export interface IEntity {
    id: string;
    max: number;
}

export interface IHass {
    states: { [key: string]: IState; };
}

export interface IState {
    attributes: { [key: string]: string; };
    state: any
}
