export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			chats: {
				Row: {
					created_at: string
					date: string | null
					id: number
					name: string | null
				}
				Insert: {
					created_at?: string
					date?: string | null
					id?: number
					name?: string | null
				}
				Update: {
					created_at?: string
					date?: string | null
					id?: number
					name?: string | null
				}
				Relationships: []
			}
			chats_users: {
				Row: {
					chat_id: number
					created_at: string
					role: Database['public']['Enums']['role']
					user_id: string
				}
				Insert: {
					chat_id: number
					created_at?: string
					role?: Database['public']['Enums']['role']
					user_id: string
				}
				Update: {
					chat_id?: number
					created_at?: string
					role?: Database['public']['Enums']['role']
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'chatsUsers_chat_id_fkey'
						columns: ['chat_id']
						isOneToOne: false
						referencedRelation: 'chats'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'chatsUsers_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			messages: {
				Row: {
					body: string | null
					chat: number
					created_at: string
					id: number
					user: string
				}
				Insert: {
					body?: string | null
					chat: number
					created_at?: string
					id?: number
					user: string
				}
				Update: {
					body?: string | null
					chat?: number
					created_at?: string
					id?: number
					user?: string
				}
				Relationships: [
					{
						foreignKeyName: 'messages_chat_fkey'
						columns: ['chat']
						isOneToOne: false
						referencedRelation: 'chats'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'messages_user_fkey'
						columns: ['user']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			users: {
				Row: {
					avatar: string | null
					created_at: string
					id: string
					location: string | null
					name: string | null
					role: Database['public']['Enums']['role'] | null
					status: Database['public']['Enums']['status'] | null
					username: string | null
				}
				Insert: {
					avatar?: string | null
					created_at?: string
					id?: string
					location?: string | null
					name?: string | null
					role?: Database['public']['Enums']['role'] | null
					status?: Database['public']['Enums']['status'] | null
					username?: string | null
				}
				Update: {
					avatar?: string | null
					created_at?: string
					id?: string
					location?: string | null
					name?: string | null
					role?: Database['public']['Enums']['role'] | null
					status?: Database['public']['Enums']['status'] | null
					username?: string | null
				}
				Relationships: [
					{
						foreignKeyName: 'users_id_fkey'
						columns: ['id']
						isOneToOne: true
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			create_chat_with_members: {
				Args: {
					chat_name: string
					members: string[]
				}
				Returns: undefined
			}
			get_chats_for_user: {
				Args: {
					user_id: string
				}
				Returns: number[]
			}
		}
		Enums: {
			role: 'owner' | 'member'
			status: 'online' | 'offline' | 'busy' | 'away'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  	? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
  	Database[PublicTableNameOrOptions['schema']]['Views'])
  	: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
	Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
			? R
			: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
	PublicSchema['Views'])
		? (PublicSchema['Tables'] &
		PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R
			}
				? R
				: never
		: never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  	? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  	: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Insert: infer I
	}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I
		}
			? I
			: never
		: never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  	? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  	: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
		Update: infer U
	}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U
		}
			? U
			: never
		: never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  	? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  	: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never
