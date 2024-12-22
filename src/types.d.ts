export interface IAutocompleteItem {
    primaryText: string;
    secondaryText?: string;
    value: string;
}

export interface IConfig {
    entities?: IEntity[];
    flex_direction: "column" | "column-reverse" | "row" | "row-reverse";
    format_label?: boolean;
    image?: string;
    readonly type: "custom:datetime-card";
    reset_forward?: boolean;
    show_expired_only?: boolean;
    show_names: boolean;
    title?: string;
}

export interface IEntity {
    friendly_name?: string;
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
