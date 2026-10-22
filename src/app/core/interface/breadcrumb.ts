export interface BreadcrumbDef {
  label: string | ((value: any) => string);
  /** Nombre del resource (clave en `resources`) del que sale el texto */
  resource?: string;
  errorLabel?: string;
}

export type CrumbStatus = 'ready' | 'loading' | 'error';


export interface Crumb {
  label: string;
  url: string;
  status: CrumbStatus;
}