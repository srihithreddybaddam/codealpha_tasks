const inMemoryInvitations = [
  {
    id: 'inv-1',
    projectId: 'prj-1',
    senderName: 'Sarah Chen',
    receiverEmail: 'david.kim@aether.io',
    role: 'Member',
    status: 'pending',
    createdAt: '2026-07-24'
  }
];

const inMemoryMembers = [
  { id: 'usr-1', name: 'Sarah Chen', email: 'sarah.chen@aether.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Owner', status: 'online', assignedTaskCount: 5 },
  { id: 'usr-2', name: 'Alex Rivera', email: 'alex.rivera@aether.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Admin', status: 'online', assignedTaskCount: 7 },
  { id: 'usr-3', name: 'Elena Rostova', email: 'elena.r@aether.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Member', status: 'focus', assignedTaskCount: 4 },
  { id: 'usr-4', name: 'Marcus Vance', email: 'marcus.v@aether.io', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Member', status: 'busy', assignedTaskCount: 3 },
  { id: 'usr-5', name: 'Aria Takahashi', email: 'aria.t@aether.io', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Admin', status: 'online', assignedTaskCount: 6 }
];

// @desc Get project members
// @route GET /api/team/members
const getMembers = async (req, res) => {
  return res.json({ success: true, count: inMemoryMembers.length, members: inMemoryMembers });
};

// @desc Send email invitation
// @route POST /api/team/invite
const inviteMember = async (req, res) => {
  try {
    const { projectId, receiverEmail, role } = req.body;

    if (!receiverEmail) {
      return res.status(400).json({ success: false, message: 'Receiver email is required' });
    }

    const invitation = {
      id: `inv-${Date.now()}`,
      projectId: projectId || 'prj-1',
      senderName: req.user?.name || 'Sarah Chen',
      receiverEmail,
      role: role || 'Member',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    inMemoryInvitations.unshift(invitation);
    return res.status(201).json({ success: true, invitation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Change member role
// @route POST /api/team/role
const updateMemberRole = async (req, res) => {
  const { memberId, role } = req.body;
  const member = inMemoryMembers.find((m) => m.id === memberId);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  member.role = role;
  return res.json({ success: true, member });
};

// @desc Remove member from project
// @route DELETE /api/team/member/:id
const removeMember = async (req, res) => {
  const index = inMemoryMembers.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  inMemoryMembers.splice(index, 1);
  return res.json({ success: true, message: 'Member removed from team' });
};

module.exports = {
  getMembers,
  inviteMember,
  updateMemberRole,
  removeMember
};
