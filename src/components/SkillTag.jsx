import { motion } from 'framer-motion';
import { Badge } from './ui/Badge';

export const SkillTag = ({ skill, type = 'technical' }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
            className="inline-block"
        >
            <Badge
                variant={type === 'gap' ? 'warning' : type === 'strength' ? 'success' : 'default'}
                className="cursor-default hover:bg-white/5 transition-colors"
            >
                {skill}
            </Badge>
        </motion.div>
    );
};
