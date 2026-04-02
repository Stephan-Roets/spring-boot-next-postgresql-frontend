"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  BookOpen,
  User,
  Users,
  Shield,
  CheckCircle2,
  ListTodo,
  UserPlus,
  FileText,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

export default function HelpPage() {
  const { user } = useAuth()
  const [expandedSection, setExpandedSection] = useState<string | null>("getting-started")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const Section = ({ id, title, icon: Icon, children }: any) => {
    const isExpanded = expandedSection === id
    return (
      <div className="rounded-xl border bg-card">
        <button
          onClick={() => toggleSection(id)}
          className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        {isExpanded && (
          <div className="border-t px-6 py-6 space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Guide</h1>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about using TaskFlow
        </p>
      </div>

      {/* Role Badge */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {user?.role === "ADMIN" ? (
              <Shield className="h-5 w-5 text-primary" />
            ) : user?.role === "MANAGER" ? (
              <Users className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Your Role</p>
            <p className="text-lg font-bold text-primary">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Getting Started */}
        <Section id="getting-started" title="Getting Started" icon={BookOpen}>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Welcome to TaskFlow!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TaskFlow is a simple task management app that helps you and your team stay organized.
                Think of it like a digital to-do list that you can share with your team.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">What You Can Do:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Create tasks (things you need to do)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Set deadlines so you don't forget when things are due</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Mark tasks as important (high, medium, or low priority)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Track your progress (pending, in progress, or done)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Work together with your team on tasks</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Understanding Roles */}
        <Section id="roles" title="Understanding Roles" icon={Shield}>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              TaskFlow has three types of users. Each role has different permissions to keep your team organized:
            </p>

            {/* USER Role */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-foreground">USER (Team Member)</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                This is the standard role for most team members.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What Users CAN do:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li>✅ Create and manage their own tasks</li>
                  <li>✅ View tasks assigned to them by managers</li>
                  <li>✅ Submit progress reports on assigned tasks</li>
                  <li>✅ Mark tasks as complete</li>
                  <li>✅ Update their own profile information</li>
                </ul>
                <p className="text-sm font-medium text-foreground mt-3">What Users CANNOT do:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li>❌ Assign tasks to other people</li>
                  <li>❌ View or edit other users' profiles</li>
                  <li>❌ Delete other users' tasks</li>
                  <li>❌ Change anyone's role or permissions</li>
                </ul>
              </div>
            </div>

            {/* MANAGER Role */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-foreground">MANAGER (Team Lead)</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Managers oversee team members and can assign work to them.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What Managers CAN do:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li>✅ Everything a USER can do, PLUS:</li>
                  <li>✅ Assign tasks to team members (USERs)</li>
                  <li>✅ View progress reports from team members</li>
                  <li>✅ Provide feedback on progress reports</li>
                  <li>✅ Extend deadlines for tasks they assigned</li>
                  <li>✅ View and edit any user's profile</li>
                  <li>✅ View all tasks in the system</li>
                </ul>
                <p className="text-sm font-medium text-foreground mt-3">What Managers CANNOT do:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li>❌ Assign tasks to other managers or admins</li>
                  <li>❌ Delete users from the system</li>
                  <li>❌ Change user roles</li>
                </ul>
              </div>
            </div>

            {/* ADMIN Role */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-foreground">ADMIN (Administrator)</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Admins have full control over the entire system.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What Admins CAN do:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                  <li>✅ Everything a MANAGER can do, PLUS:</li>
                  <li>✅ Assign tasks to anyone (users, managers, or other admins)</li>
                  <li>✅ Delete any user from the system</li>
                  <li>✅ Change user roles (promote users to managers, etc.)</li>
                  <li>✅ View, edit, or delete any task in the system</li>
                  <li>✅ Manage all user profiles</li>
                  <li>✅ Full access to all features</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Managing Your Tasks */}
        <Section id="my-tasks" title="Managing Your Tasks" icon={ListTodo}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">How to Create a Task</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Click on "My Todos" in the left sidebar</li>
                <li>2. Click the blue "New Task" button in the top right</li>
                <li>3. Fill in the task details:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Title:</strong> A short name for your task (e.g., "Finish report")</li>
                    <li>• <strong>Description:</strong> More details about what needs to be done</li>
                    <li>• <strong>Priority:</strong> How important is it? (Low, Medium, or High)</li>
                    <li>• <strong>Category:</strong> What type of task? (e.g., "Work", "Personal")</li>
                    <li>• <strong>Due Date:</strong> When does it need to be done?</li>
                  </ul>
                </li>
                <li>4. Click "Create Task" to save it</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">How to Update a Task</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Find your task in the "My Todos" page</li>
                <li>2. Click the pencil icon (✏️) on the task card</li>
                <li>3. Make your changes</li>
                <li>4. Click "Update Task" to save</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Task Status Explained</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• <strong className="text-amber-600">Pending:</strong> You haven't started yet</li>
                <li>• <strong className="text-blue-600">In Progress:</strong> You're currently working on it</li>
                <li>• <strong className="text-emerald-600">Done:</strong> The task is complete!</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">How to Delete a Task</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Find the task you want to delete</li>
                <li>2. Click the trash icon (🗑️) on the task card</li>
                <li>3. Confirm you want to delete it</li>
                <li className="text-amber-600">⚠️ Warning: Deleted tasks cannot be recovered!</li>
              </ol>
            </div>
          </div>
        </Section>

        {/* Task Assignment (Manager/Admin only) */}
        {(user?.role === "MANAGER" || user?.role === "ADMIN") && (
          <Section id="assign-tasks" title="Assigning Tasks to Others" icon={UserPlus}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                As a {user?.role}, you can assign tasks to team members and track their progress.
              </p>

              <div>
                <h4 className="font-semibold text-foreground mb-2">How to Assign a Task</h4>
                <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>1. Click on "My Assignments" in the left sidebar</li>
                  <li>2. Click the "Assign Task" button</li>
                  <li>3. Select who you want to assign the task to:
                    <ul className="ml-4 mt-1 space-y-1">
                      {user?.role === "ADMIN" && (
                        <li>• As an ADMIN, you can assign to anyone (users, managers, or admins)</li>
                      )}
                      {user?.role === "MANAGER" && (
                        <li>• As a MANAGER, you can only assign to team members (users)</li>
                      )}
                    </ul>
                  </li>
                  <li>4. Fill in the task details (title, description, priority, deadline)</li>
                  <li>5. Click "Assign Task"</li>
                  <li>6. The person will see it in their "Assigned to Me" page</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Viewing Progress Reports</h4>
                <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>1. Go to "My Assignments"</li>
                  <li>2. Click on any task you've assigned</li>
                  <li>3. The right panel shows all progress reports</li>
                  <li>4. You can click "Provide Feedback" to respond to reports</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Extending Deadlines</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  If someone needs more time, you can extend the deadline:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>1. Go to "My Assignments"</li>
                  <li>2. Find the task</li>
                  <li>3. Click on it to view details</li>
                  <li>4. Look for the "Extend Deadline" option</li>
                  <li>5. Choose a new date and provide a reason</li>
                  <li>6. The original deadline is saved for reference</li>
                </ol>
              </div>
            </div>
          </Section>
        )}

        {/* Working on Assigned Tasks */}
        <Section id="assigned-to-me" title="Working on Assigned Tasks" icon={FileText}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              When someone assigns you a task, you'll find it in "Assigned to Me".
            </p>

            <div>
              <h4 className="font-semibold text-foreground mb-2">How to Submit a Progress Report</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Go to "Assigned to Me" in the sidebar</li>
                <li>2. Find the task you want to report on</li>
                <li>3. Click the "Submit Report" button</li>
                <li>4. Choose the type of report:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Progress Update:</strong> Share what you've done so far</li>
                    <li>• <strong>Task Completed:</strong> Let them know you're finished</li>
                    <li>• <strong>Report Issue:</strong> Explain any problems or blockers</li>
                  </ul>
                </li>
                <li>5. Write your message explaining the progress</li>
                <li>6. Click "Submit Report"</li>
                <li>7. The person who assigned it will see your update</li>
              </ol>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 Tip:</strong> When you submit a "Task Completed" report, the task automatically
                changes to "Done" status. This lets everyone know you've finished!
              </p>
            </div>
          </div>
        </Section>

        {/* Profile Management */}
        <Section id="profile" title="Managing Your Profile" icon={User}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">How to Update Your Profile</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>1. Click on "Profile" in the left sidebar</li>
                <li>2. You'll see your current information</li>
                <li>3. Click the "Edit Profile" button</li>
                <li>4. Update any information you want to change:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Name</li>
                    <li>• Phone number</li>
                    <li>• Address</li>
                    <li>• Department</li>
                    <li>• Bio (a short description about yourself)</li>
                  </ul>
                </li>
                <li>5. Click "Save Changes"</li>
              </ol>
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>⚠️ Note:</strong> You cannot change your email address or role. If you need to change
                these, please contact your administrator.
              </p>
            </div>
          </div>
        </Section>

        {/* Tips & Best Practices */}
        <Section id="tips" title="Tips & Best Practices" icon={MessageSquare}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">📝 Writing Good Task Titles</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>✅ Good: "Finish Q1 sales report by Friday"</li>
                <li>❌ Avoid: "Report"</li>
                <li className="text-foreground">Be specific and include key details!</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">⏰ Setting Deadlines</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Set realistic deadlines you can actually meet</li>
                <li>• Add buffer time for unexpected delays</li>
                <li>• If you need more time, report it early - don't wait until the deadline!</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">🎯 Using Priorities</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• <strong className="text-red-600">High:</strong> Urgent and important - do these first</li>
                <li>• <strong className="text-amber-600">Medium:</strong> Important but not urgent - plan for these</li>
                <li>• <strong className="text-emerald-600">Low:</strong> Nice to have - do when you have time</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">💬 Communicating Progress</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Update your progress regularly (at least once a week for long tasks)</li>
                <li>• Be honest about challenges - it's better to ask for help early</li>
                <li>• When reporting issues, suggest possible solutions if you can</li>
                <li>• Respond to feedback from managers promptly</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Common Questions */}
        <Section id="faq" title="Common Questions" icon={MessageSquare}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Q: Can I see other people's tasks?</h4>
              <p className="text-sm text-muted-foreground ml-4">
                A: Users can only see their own tasks and tasks assigned to them. Managers and Admins
                can see all tasks in the system.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Q: What happens if I miss a deadline?</h4>
              <p className="text-sm text-muted-foreground ml-4">
                A: The task will show as overdue, but you can still complete it. If you know you'll miss
                a deadline, submit a progress report explaining why and ask for an extension.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Q: Can I delete a task someone assigned to me?</h4>
              <p className="text-sm text-muted-foreground ml-4">
                A: Yes, you can delete tasks assigned to you. However, it's better to discuss with the
                person who assigned it first, or submit a report explaining why it can't be completed.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Q: How do I know if someone read my progress report?</h4>
              <p className="text-sm text-muted-foreground ml-4">
                A: When the person who assigned the task provides feedback, you'll see their response
                below your report. Check back periodically or ask them directly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Q: Can I change my role from USER to MANAGER?</h4>
              <p className="text-sm text-muted-foreground ml-4">
                A: No, only Admins can change user roles. If you need a role change, contact your
                system administrator.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* Need More Help */}
      <div className="rounded-xl border bg-card p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Still Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you have questions not covered in this guide, please contact your system administrator
          or team manager for assistance.
        </p>
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">
          <MessageSquare className="h-4 w-4" />
          Your current role: <strong>{user?.role}</strong>
        </div>
      </div>
    </div>
  )
}
