import 'package:flutter/material.dart';

class ResultCard extends StatelessWidget {
  final String title;
  final double value;
  final String unit;
  final IconData icon;

  const ResultCard({
    super.key,
    required this.title,
    required this.value,
    required this.unit,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final formattedValue = value.toStringAsFixed(3);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: theme.colorScheme.secondary,
              width: 5,
            ),
          ),
        ),
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: theme.colorScheme.secondary.withOpacity(0.1),
            child: Icon(icon, color: theme.colorScheme.secondary),
          ),
          title: Text(
            title,
            style: const TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500),
          ),
          trailing: Text(
            '$formattedValue $unit',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              fontFamily: 'monospace',
              color: theme.colorScheme.onSurface,
            ),
          ),
        ),
      ),
    );
  }
}
