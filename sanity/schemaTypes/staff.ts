export const staffSchema = {
  name: 'staff',
  title: 'Authorized Staff',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Must match their Clerk login email',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: ['General Manager', 'OPM', 'Supervisor', 'Owner']
      }
    }
  ]
}

