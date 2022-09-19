export type OrganisationDto = {
  boss: {
    user_id: string;
    role_name: string;
  };
  member: {
    user_ids: string[];
    role_name: string;
  };
  subsets: OrganisationDto[];
};
