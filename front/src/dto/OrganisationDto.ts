export type OrganisationDto = {
  id: string;
  name: string;
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
